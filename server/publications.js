Meteor.publish('singleQuestion', function(){
  return Questions.find({date: new Date().toDateString()},{fields: {
    correctChoice: 0
  }});
});

Meteor.publish('tags', function(){
  return Tags.find();
});

Meteor.publish('singleTag', function(name){
  return Tags.find({name: name});
});

Meteor.publish('userData', function(){
  return Meteor.users.find({_id: this.userId}, {
    fields: {
      'tags' : 1,
      'totalQuestionsAnswered' : 1
    }
  })
});

Meteor.publish('singleSuggestion', function(id){
  return SuggestedQuestions.find({_id:id});
});

Meteor.publish('suggestedQuestions', function(){
  return SuggestedQuestions.find();
})

Meteor.publish('topTenUsers', function(sortName,tagIndex){
//  var selector = (sortSpecifier == 'totalQuestionsAnswered') ? {} : {'tags.name': sortSpecifier.substring(sortSpecifier.indexOf('.') +1,sortSpecifier.lastIndexOf('.'))};
//  console.log('publish top10 selector')
//  console.log(selector);
//  return Meteor.users.find(selector,{
//    sort:{
//      sortSpecifier:-1 
//    },
//    limit: 10,
//    fields: {
//      username : 1,
//      tags : 1,
//      totalQuestionsAnswered: 1
//    }
//  })
  var tagSort = 'tags.$.' + sortName + '.correct';
  var sortSpecifier = (sortName === 'totalQuestionsAnswered') ? {totalQuestionsAnswered: -1} : {tagSort: -1}
  return Meteor.users.find({'tags.name': sortName},{
    sort: sortSpecifier,
    limit: 10,
    fields: {
      username: 1,
      tags: 1,
      totalQuestionsAnswered: 1
    }
  })
});