SuggestedQuestions = new Mongo.Collection('suggestedQuestions');
SuggestedQuestions.attachSchema(Schemas.Questions);

SuggestedQuestions.allow({
  insert: function(userId,question){
    check(question,Schemas.Questions);
    return !!userId;
  }
});

Meteor.methods({
  processSuggestion: function(type,suggestionId){
    if(type === 'approve'){
      console.log('inserting approved question', SuggestedQuestions.findOne({_id: suggestionId}))
      Questions.insert(SuggestedQuestions.findOne({_id: suggestionId}))
    }
    SuggestedQuestions.remove(suggestionId);
  }
})