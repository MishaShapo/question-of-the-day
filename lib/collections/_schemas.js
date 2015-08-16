Schemas = {};

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
  },
  color: {
    type: String,
    optional: true,
    regEx: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
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

Schemas.SuggestedQuestions = new SimpleSchema({
  text: {
    type: String,
    label: 'Text'
  }, 
  choices : {
    type: [String],
    label: 'Choices',
    minCount: 4,
    maxCount: 4
  },
  correctChoice : {
    type: Number,
    label: 'Correct Choice',
    allowedValues : [1,2,3,4]
  },
  tag: {
    type: String,
    label: 'Tag'
  }
});

//Schemas.SuggestedQuestions.labels({
//  'choices.$' : function() {
//    return 'dags';
//  }
//});


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
    optional: true
  },
  'tags.$.name' : {
    type: String
  },
  'tags.$.correct' : {
    type: Number
  },
  'tags.$.wrong' : {
    type: Number
  },
  'tags.$.color': {
    type: String
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