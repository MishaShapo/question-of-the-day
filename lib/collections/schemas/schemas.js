Schemas = {};

SimpleSchema.debug = true;

Schemas.Tags = new SimpleSchema({
  _id: {
    type: String,
    optional:true
  },
  name: {
    type: String,
    label: "Tag Name"
  },
  correct: {
    type: Number,
    label: "Correct",
    min: 0,
    optional: true
  },
  wrong: {
    type: Number,
    label: "Wrong",
    min: 0,
    optional: true
  }
});

Schemas.Questions = new SimpleSchema({
  text: {
    type: String,
    label: "Text"
  },
  choices: {
    type: [String],
    label: "Choices",
    minCount: 4,
    maxCount: 4
  },
  correctChoice: {
    type: Number,
    label: "Correct Choice",
    min: 0,
    max: 3
  },
  date: {
    type: String,
    label: "Date String",
    denyUpdate: true
  },
  tag: {
    type: String,
    label: "Tag",
  }
});



Schemas.User = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,25}/,
    optional: true
  },
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified":{
    type: Boolean
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  profile: {
    type: Object,
    optional: true,
    blackbox: true
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if(this.isInsert){
        return new Date;
      } else if (this.isUpsert){
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    }
  },
  roles: {
    type: [String],
    optional: true
  },
  tags: {
    type: [Schemas.Tags],
    label: "Tags",
    optional: true//,
//    custom: function() {
//      console.log('custom validation');
//      console.log(this.value);
//      return true;
//    }
//    autoValue: function(){
//      if(this.isSet){
//        if(this.isInsert){
//          return [this.value];
//        } else {
//          return {
//            $push: this.value
//          }
//        }
//      } else {
//        this.unset();
//      }
//    }
  },
  'tags.$.name' : {
    type: String,
    custom: function() {
      console.log('custom validation name');
      console.log(this.value);
      return true;
    }
  },
  'tags.$.correct' : {
    type: Number,
    custom: function() {
      console.log('custom validation correct');
      console.log(this.value);
      return true;
    }
  },
  'tags.$.wrong' : {
    type: Number,
    custom: function() {
      console.log('custom validation wrong');
      console.log(this.value);
      return true;
    }
  },
  totalQuestionsAnswered: {
    type: Number,
    label: "Total Number of Answered Questions",
    min:0,
    optional: true
  },
  hasAnsweredCurrentQuestion: {
    type: Boolean,
    optional: true
  }
});

Meteor.users.attachSchema(Schemas.User);