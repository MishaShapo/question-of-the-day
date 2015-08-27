Template.singleSuggestion.helpers({
  suggestionDoc: function(){
    return SuggestedQuestions.findOne();
  }
});

Template.singleSuggestion.events({
  'click button' : function(e){
    if(e.target.id === 'approve'){
      Meteor.call('processSuggestion','approve',SuggestedQuestions.findOne()._id, function(){
        FlowRouter.go('/admin/suggestionList');
      });
    } else if(e.target.id === 'deny'){
      Meteor.call('processSuggestion','deny',SuggestedQuestions.findOne()._id, function(){
        FlowRouter.go('/admin/suggestionList');
      });
    }
  }
});

Template.singleSuggestion.onRendered(function(){
  var choice = SuggestedQuestions.findOne().correctChoice;
  console.log('onRendered singleSuggestion',choice);
  var elem = this.$('ul');
  console.log(elem, 'length',elem.length);
  console.log('children',elem.children())
  elem.css('background-color','greenyellow');
});