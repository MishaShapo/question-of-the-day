Questions = new Mongo.Collection('questions');
Questions.attachSchema(Schemas.Questions);

Meteor.methods({
  validateAnswer: function(answer){
    check(answer,String);
    
    var question = Questions.findOne({date: new Date().toDateString()});
    var correct = question.choices[question.correctChoice] === answer;
    var userId = this.userId;
    var userUpdateObj = {$inc : {}};
    
    if(userId){
      
      userUpdateObj['$inc']['tags.' + question.tag] =
        {
          correct: (correct) ? 1 : 0,
          wrong: (correct) ? 0 : 1
        };
      userUpdateObj['$inc']['totalQuestionsAnswered'] = 1;
      Meteor.users.update(userId,userUpdateObj); 
    }
    
    return correct;
  }
});