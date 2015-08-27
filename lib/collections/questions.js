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
  'giveTags' : function(newId){
    
    if (!newId){
      newId = Meteor.userId;
    } 
    var tagNums = [];
    for(var i = 0; i < 8; i++){
      tagNums.push(Math.round(Math.random() * 50 + 10));
    }
    var sum = tagNums.reduce(function(prev,cur){return prev+cur;},0);
    Meteor.users.update(newId, {$set:{
      tags: [
      {
        name: 'History',
        correct: tagNums[0],
        wrong: tagNums[1],
        color:  "#e7ba52"
      },
      {
        name:'Math',
        correct: tagNums[2],
        wrong: tagNums[3],
        color: "#3182bd"
      },
      {
        name: 'Literature',
        correct: tagNums[4],
        wrong: tagNums[5],
        color: "#a55194"
      },
      {
        name: 'Science',
        correct: tagNums[6],
        wrong: tagNums[7],
        color: "#ad494a"
      }
    ],
    totalQuestionsAnswered: sum,
    roles: ['admin'] 
    }});
  },
  'makeAdmin': function(userId){
    Roles.addUsersToRoles(userId, ['admin']);
  }
});