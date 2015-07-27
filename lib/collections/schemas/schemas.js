Schemas = {};

SimpleSchema.debug = true;

Schemas.zeroOrInc = function (){
  if(this.isInsert || this.isUpsert){
    return {$setOnInsert: 0};
  } else if(!this.isFromTrustedCode){
      return this.unset();
  }
}

//this.isUpdate && this.isFromTrustedCode && this.isSet && this.operator==="$inc"

Schemas.Tags = new SimpleSchema({
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

Schemas.QuestionStatistics = new SimpleSchema({
  totalCorrectAnswers: {
    type: Number,
    label: "Total Number of Correct Answers",
    min: 0,
    optional: true
  },
  totalWrongAnswers : {
    type: Number,
    label: "Total Number of Wrong Answers",
    min: 0,
    optional: true
  },
  userCorrectAnswers : {
    type: Number,
    label: "Number of Correct Answers From Users",
    min: 0,
    optional: true
  },
  userWrongAnswers: {
    type: Number,
    label: "Number of Wrong Answers From Users",
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
  tags: {
    type: [Schemas.Tags],
    label: "Tags",
    minCount: 1,
    optional: true,
    autoform: {
      options: function() {
        return _.map(Tags.find().fetch, function(t){
          console.log('Finding tags. Here is one: ' + t.name);
          return {label: t.name, value: t._id};
        });
      }
    }
  },
  statistics: {
    type: Schemas.QuestionStatistics,
    label: "Statistics",
    optional: true
  }
});



Schemas.User = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,25}/
  },
  emails: {
    type: [Object]
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified":{
    type: Boolean
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
  statistics: {
    type: Schemas.UserStatistics,
    label: "User Statistics",
    optional: true
  }
});
  
Schemas.UserStatistics = new SimpleSchema({
  tags: {
    type: [Schemas.Tags],
    label: "Tags",
    optional: true
  },
  longestStreak: {
    type: Object,
    label: "Longest Streak",
    optional: true
  },
  "longestStreak.dateStarted" : {
    type: Date,
    label: "Date Streak Began",
    autoValue: function() {
      var curStreak = this.field('longestStreak.currentStreak');
      var oldStreak = this.field('longestStreak.oldStreak');
      if(curStreak !== undefined){
        if(curStreak >= oldStreak || oldStreak === undefined){
          var newDate = new Date();
          newDate.setDate(newDate.getDate() - curStreak);
          return newDate;
        }
      }
    }
  },
  "longestStreak.oldStreak": {
    type: Number,
    label: "Longest Streak im Days",
    min: 0,
    autoValue: function() {
      var curStreak = this.field('longestStreak.currentStreak');
      var oldStreak = this.field('longestStreak.oldStreak');
      if(curStreak !== undefined){
        if(oldStreak !== undefined){
          return (curStreak >= oldStreak) ? curStreak : oldStreak;
        } else {
          return curStreak;
        }
      } else {
        this.unset();
      }
    }
  },
  "longestStreak.currentStreak": {
    type: Number,
    label: "Current Streak in Days",
    min: 0,
    optional: true
  },
  totalQuestionsAnswered: {
    type: Number,
    label: "Total Number of Answered Questions",
    optional: true
  }
});
