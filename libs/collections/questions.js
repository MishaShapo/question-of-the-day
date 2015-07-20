Questions = new Mongo.Collection('questions');

Meteor.methods({
  validateAnswer: function(answer){
    check(answer,String);
    check(clientAddress,String)
    
    var question = Questions.findOne({date: new Date().toDateString()});
    return question.choices[question.correctChoice] === answer;
  }
})