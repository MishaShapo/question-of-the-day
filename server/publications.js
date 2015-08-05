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