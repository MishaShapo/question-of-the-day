Questions = new Mongo.Collection('questions');
Questions.attachSchema(Schemas.Questions);

Meteor.methods({
  validateAnswer: function(answer){
    check(answer,String);
    
    var question = Questions.findOne({date: new Date().toDateString()});
    var correct = question.choices[question.correctChoice] === answer;
    
    if(Meteor.user()){
      var upsertResult = Meteor.users.update({
        _id: this.userId,
        'tags.name' : question.tag
      },{
        $inc: {
          'tags.$.correct': (correct) ? 1 : 0,
          'tags.$.wrong' : (correct) ? 0 : 1
        }
      });
      if(!upsertResult){
        Meteor.users.upsert({
          _id : this.userId
        },{
          $addToSet: {
            tags: {
              name: question.tag,
              correct: (correct) ? 1: 0,
              wrong: (correct) ? 0 : 1,
              color: Tags.findOne({name:question.tag}).color
            }
          }
        });
      }
      Meteor.users.update(this.userId,{$inc:{totalQuestionsAnswered: 1}, $set:{hasAnsweredCurrentQuestion: true}});

    }
    
    return correct;
  },
  'giveTags' : function(){
    Meteor.users.update(Meteor.userId(), {$set:{
      tags: [
      {
        name: 'History',
        correct: 9,
        wrong: 8,
        color:  "#e7ba52"
      },
      {
        name:'Math',
        correct: 15,
        wrong: 3,
        color: "#3182bd"
      },
      {
        name: 'Literature',
        correct: 4,
        wrong: 27,
        color: "#a55194"
      },
      {
        name: 'Science',
        correct: 6,
        wrong: 0,
        color: "#ad494a"
      }
    ],
    totalQuestionsAnswered: 72
    }});
  }
});