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
    label: "Text",
    autoform : {
      placeholder: "What does Misha plan to use for world domination?"
    }
  },
  choices: {
    type: [String],
    label: "Choices",
    minCount: 4,
    maxCount: 4
  },
  'choices.$' : {
    type: String,
    autoform: {
      placeholder: function() {
        var index = this.name.charAt(this.name.length-1);
        if(index == 0){
          return 'Puppies, millions of puppies';
        } else if(index == 1){
          return 'Sarcasm';
        } else if(index == 2){
          return 'A question-based website with cool graphics';
        } else {
          return 'A herd of galloping papayas';
        }
      }
    }
  },  
  correctChoice: {
    type: Number,
    label: "Correct Choice",
    min: 0,
    max: 3,
    autoform : {
      options: [
        {label:"1",value:0},
        {label:"2",value:1},
        {label:"3",value:2},
        {label:"4",value:3}
      ]
    }
  },
  date: {
    type: String,
    label: "Date String",
    denyUpdate: true,
    autoValue: function(){
      if(this.isFromTrustedCode){
        //'We on the server. All good. BD
        return;
      }
      if(this.isInsert){
        return new Date().toDateString();
      } else {
        this.unset();
      }
    },
    autoform: {
      omit: true
    }
  },
  author: {
    type: String,
    autoValue: function(){
      if(this.isFromTrustedCode){
        //'We on the server. All good. BD
        return;
      }
      var user = Meteor.user();
      if(!!user){
        return user.username;
      } else {
        this.unset();
      }
    
    },
    optional: true,
    autoform: {
      omit: true
    }
  },
  tag: {
    type: String,
    label: "Tag"
  }
});

Schemas.leaderboardSelection = new SimpleSchema({
  tags: {
    type: String,
    label: "Tags"
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

Meteor.methods('addAdmin', function(idToAdd){
  if(Roles.userIsInRole(Meteor.user(),['admin'])){
    Roles.addUsersToRoles(id, ['admin']);
  }
})