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
      Questions.insert(SuggestedQuestions.find(suggestionId))
    }
    SuggestedQuestions.remove(suggestionId);
  }
})