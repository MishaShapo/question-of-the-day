Questions = new Mongo.Collection('questions');
//Questions.attachSchema(Schemas.Questions);

Meteor.methods({
  validateAnswer: function(answer){
    check(answer,String);
    
    var question = Questions.findOne({date: new Date().toDateString()});
    var correct = question.choices[question.correctChoice] === answer;
    var userId = Meteor.userId();
    var questionUpdateObj = {$inc : {}};
    var userUpdateObj = {$inc : {}};
    if(correct){
      questionUpdateObj['$inc']['statistics.totalCorrectAnswers'] = 1;
      if(userId){
        questionUpdateObj['$inc']['statistics.userCorrectAnswers'] = 1;
      }
    } else {
      questionUpdateObj['$inc']['statistics.totalWrongAnswers'] = 1;
      if(userId){
        questionUpdateObj['$inc']['statistics.userWrongAnswers'=] = 1;
      }
    }
    Questions.update(questionUpdateObj);
                                  
    
    return correct;
  }
});

var Schemas = {};

Schemas.Questions = new SimpleSchema({
  text: {
    type: String,
    label: "Text",
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
  tags: {
    type: [String],
    label: "Tags",
    minCount: 1
  },
  statistics: {
    type: Schemas.QuestionStatistics,
    label: "Statistics",
    optional: true
  }
});

Schemas.QuestionStatistics = new SimpleSchema({
  totalCorrectAnswers: {
    type: Number,
    label: "Total Number of Correct Answers",
    min: 0,
    autoValue: Schemas.zeroOrInc
  },
  totalWrongAnswers : {
    type: Number,
    label: "Total Number of Wrong Answers",
    min: 0,
    autoValue: Schemas.zeroOrInc
  },
  userCorrectAnswers : {
    type: Number,
    label: "Number of Correct Answers From Users",
    min: 0,
    autoValue: Schemas.zeroOrInc
  },
  userWrongAnswers: {
    type: Number,
    label: "Number of Wrong Answers From Users",
    min: 0,
    autoValue: Schemas.zeroOrInc
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
    label: "Tags"
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
      if(curStreak !== undefined && oldStreak !== undefined){
        if(curStreak >= oldStreak){
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
      if(curStreak !== undefined && oldStreak !== undefined){
        return (curStreak >= oldStreak) ? curStreak : oldStreak;
      }
      //implicitly return undefined
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
    autoValue: Schemas.zeroOrInc
  }
});

Schemas.Tags = new SimpleSchema({
  name: {
    type: String,
    label: "Tag Name"
  },
  correct: {
    type: Number,
    label: "Correct",
    min: 0,
    autoValue: Schemas.zeroOrInc
  },
  wrong: {
    type: Number,
    label: "Wrong",
    min: 0,
    autoValue: Schemas.zeroOrInc
  }
});

Schemas.zeroOrInc = function (){
  if(this.isInsert || this.isUpsert){
    return {$setOnInsert: 0};
  } else if(this.isUpdate && this.isFromTrustedCode && this.isSet && this.operator==="$inc"){
      return {$inc : 1}
  } else {
    this.unset();
  }
}