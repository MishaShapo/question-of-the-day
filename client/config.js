Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
})

AutoForm.addHooks(['insertSuggestedQuestionForm'],{after:{insert: function(error,result){
  if(error){
    FlowRouter.go('failedSuggestion');
  } else {
    FlowRouter.go('successfulSuggestion');
  }
}}});

AutoForm.addHooks(['singleSuggestionViewForm'],{before:{disabled: function(){
  var choice = SuggestedQuestions.findOne().correctChoice;
  console.log('AutoForm hook singleSuggestion',choice);
  var elem = this.$('ul.list-group li:nth-child(' + choice + ')');
  console.log(elem);
  elem.css('background-color','greenyellow');
}}});