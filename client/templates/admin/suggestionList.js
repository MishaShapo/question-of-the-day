Template.suggestionList.helpers({
  suggestions : function() {
    return SuggestedQuestions.find();
  },
  numSuggestions: function(){
    return SuggestedQuestions.find().count();
  }
})