Template.question.onCreated(function (){
  var responseData = Session.get('responseData');
  if(responseData){
    if(responseData.curQuestionDate !== new Date().toDateString()){
      Session.setPersistent('responseData',{
        alreadyAnswered: false,
        curQuestionDate: undefined,
        userChoiceID: undefined
      });
    }
    responseData = Session.get('responseData');
    if(responseData.alreadyAnswered){
      $('.answerChoice input:radio').attr('disabled',true);
      $('#' + Session.get('responseData').userChoiceID).attr('checked',true);
      $('button[form="response-form"]').attr('disabled',true);
    }
  }
  
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function() {
    var handle = QuestionSubs.subscribe('questions');
    self.ready.set(handle.ready());
  });
});

Template.question.events({
  'submit form': function(e){
    e.preventDefault();
    
    var answer = $(e.target).find('input:checked ~ label').text();
    var choiceID = $('input:checked').filter(':first').attr('id');
    if(null == answer){
      return throwError('Please select an answer');
    }
    
    console.log('answer : ' + answer);
    var self = this;
    Meteor.call('validateAnswer',answer, function(error, result){
      if(!error){
        $('.answerChoice input:radio').attr('disabled',true);
        $('button[form="response-form"]').attr('disabled',true);
          Session.setPersistent('responseData',{
            alreadyAnswered: true,
            curQuestionDate: self.date,
            userChoiceID : choiceID 
          });
      } else{
        throw new Meteor.Error(error.message);
      }
      console.log("result : " + result);
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
  }
});