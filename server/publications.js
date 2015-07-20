Meteor.publish('questions', function() {
  return Questions.find({date: new Date().toDateString()},{fields: {
    text: 1,
    choices: 1,
    date: 1
  }});
});