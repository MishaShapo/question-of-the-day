Meteor.publish('singleQuestion', function(){
  return Questions.find({date: new Date().toDateString()},{fields: {
    text: 1,
    choices: 1,
    date: 1,
    tag: 1
  }});
});

Meteor.publish('tags', function(){
  return Tags.find();
});

Meteor.publish('userData', function(){
  return Meteor.users.find({_id: this.userId}, {
    fields: {
      'tags' : 1,
      'totalQuestionsAnswered' : 1
    }
  })
});