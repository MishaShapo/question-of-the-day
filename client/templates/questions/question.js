Template.question.onCreated(function (){
  var self = this;
  self.ready = new ReactiveVar();
  self.correct = new ReactiveVar();
  self.autorun(function() {
    var handle = QuestionSubs.subscribe('singleQuestion');
    self.ready.set(handle.ready());
  });
});

Template.question.onRendered(function() {
  var responseData = Session.get('responseData');
  if(responseData){
    if(responseData.curQuestionDate !== new Date().toDateString()){
      Session.setPersistent('responseData',{
        alreadyAnswered: false,
        curQuestionDate: undefined,
        userChoiceID: undefined
      });
    }
  }
  
});

Template.question.events({
  'submit form': function(e){
    e.preventDefault();
    
    var answer = $(e.target).find('input:checked ~ label').text();
    var choiceID = $('input:checked').filter(':first').attr('id');
    if(null == answer){
      return throwError('Please select an answer');
    }
    
    var self = this;
    var instance = Template.instance();
    Meteor.call('validateAnswer',answer, function(error, result){
      if(!error){
          Session.setPersistent('responseData',{
            alreadyAnswered: true,
            curQuestionDate: self.date,
            userChoiceID : choiceID 
          });
      } else{
        throw new Meteor.Error(error.message);
      }
      instance.correct.set(result);
    });
  }
});

Template.question.helpers({
  index: function (str){
    return "choice_" + Questions.findOne().choices.indexOf(str);
  },
  subReady : function(){
    return Template.instance().ready.get();
  },
  question: function(){
    return Questions.findOne();
  },
  correct: function(){
    return Template.instance().correct.get();
  },
  alreadyAnswered: function(){
    var responseData = Session.get('responseData');
    return responseData && responseData.alreadyAnswered;
  },
  disableProp : function() {
    var responseData = Session.get('responseData');
    if(responseData && responseData.alreadyAnswered){
      return 'disabled'
    } else {
      return '';
    }
  }
});