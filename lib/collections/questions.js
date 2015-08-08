Questions = new Mongo.Collection('questions');
Questions.attachSchema(Schemas.Questions);

Meteor.methods({
  validateAnswer: function(answer){
    check(answer,String);
    
    var question = Questions.findOne({date: new Date().toDateString()});
    var correct = question.choices[question.correctChoice] === answer;
    
    
    if(Meteor.user()){
      console.log('question in meteor method : ' + question.tag);
      console.log(Meteor.users.find({
        '_id' : this.userId,
        'tags.name' : question.tag
        }
      ).fetch());
      console.log('Meteor user')
      console.log(Meteor.users.find().fetch());
      
      var index = Meteor.users.find
      var upsertResult = Meteor.users.update({
        _id: this.userId,
        'tags.name' : question.tag
      },{
        $inc: {
          'tags.$.correct': (correct) ? 1 : 0,
          'tags.$.wrong' : (correct) ? 0 : 1
        }
      });
      
      //console.log('affected : ' + upsertResult.numberAffected + ', id: ' + upsertResult.insertedId);
      if(!upsertResult){
        console.log('New tag. Adding to users set of tags.');
        Meteor.users.upsert({
          _id : this.userId
        },{
          $addToSet: {
            tags: {
              name: question.tag,
              correct: (correct) ? 1: 0,
              wrong: (correct) ? 0 : 1
            }
          }
        });
      } else {
        console.log('Tag already exisyed and properly updated');
      }
      
      Meteor.users.update(this.userId,{$inc:{totalQuestionsAnswered: 1}, $set:{hasAnsweredCurrentQuestion: true}});

    }
    
    return correct;
  }
});