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
      
      var upsertResult = Meteor.users.update({
        _id: userId,
        'tags.$.name' : question.tag
      },{
        $inc: {
          'tags.$.correct': (correct) ? 1 : 0,
          'tags.$.wrong' : (correct) ? 0 : 1
        }
      });
      
      //console.log('affected : ' + upsertResult.numberAffected + ', id: ' + upsertResult.insertedId);
      if(!upsertResult){
        Meteor.users.upsert({
          _id : userId
        },{
          $addToSet: {
            tags: {
              name: question.tag,
              correct: (correct) ? 1: 0,
              wrong: (correct) ? 0 : 1
            }
          }
        });
      }
      
      Meteor.users.update(userId,{$inc:{totalQuestionsAnswered: 1}});

    }
    
    return correct;
  }
});