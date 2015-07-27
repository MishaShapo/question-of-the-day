Questions = new Mongo.Collection('questions');
Questions.attachSchema(Schemas.Questions);

Meteor.methods({
  validateAnswer: function(answer){
    check(answer,String);
    
    var question = Questions.findOne({date: new Date().toDateString()});
    var correct = question.choices[question.correctChoice] === answer;
    var userId = Meteor.userId();
    var questionUpdateObj = {$inc : {}};
    var userUpdateObj = {$inc : {}, $addToSet: {}};
    if(correct){
      questionUpdateObj['$inc']['statistics.totalCorrectAnswers'] = 1;
      if(userId){
        questionUpdateObj['$inc']['statistics.userCorrectAnswers'] = 1;
      }
    } else {
      questionUpdateObj['$inc']['statistics.totalWrongAnswers'] = 1;
      if(userId){
        questionUpdateObj['$inc']['statistics.userWrongAnswers'] = 1;
      }
    }
    Questions.update(question._id,questionUpdateObj);
    
    if(userId){
      userUpdateObj['$addToSet']['statistics.Tags'] = {$each: question.tags.map(function(t){
        return {
          name: t.name,
          correct: (correct) ? 1 : 0,
          wrong: (correct) ? 0 : 1
        }
      })};
      userUpdateObj['$inc']['statistics.totalQuestionsAnswered'] = 1;
      if(correct){
        userUpdateObj['$inc']['statistics.longestStreak.currentStreak'] = 1;
      }
     Meteor.users.update(userId,userUpdateObj,{upsert:true}); 
    }
    
    
    return correct;
  }
});