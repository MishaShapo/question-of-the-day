Template.question.onCreated(function (){
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function() {
    var questionHandle = QuestionSubs.subscribe('singleQuestion');
    if(questionHandle.ready()){
      var tagHandle = QuestionSubs.subscribe('singleTag',Questions.findOne().tag);
    }
    self.ready.set(questionHandle.ready() && tagHandle.ready());
  });
});

Template.question.onRendered(function() {
  var responseData = Session.get('responseData');
  if(responseData){
    if(responseData.curQuestionDate !== new Date().toDateString()){
      Session.setPersistent('responseData',{
        userCorrect: undefined,
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
            userCorrect: result,
            curQuestionDate: self.date,
            userChoiceID : choiceID 
          });
      } else{
        throw new Meteor.Error(error.message);
      }
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
  alreadyAnswered : function(){
    var responseData = Session.get('responseData');
    return !!responseData && responseData.userCorrect !== undefined;
  },
  correct: function(){
    var responseData = Session.get('responseData');
    return !!responseData && responseData.userCorrect;
  },
  disableProp : function() {
    var responseData = Session.get('responseData');
    if(!!responseData && responseData.userChoiceID !== undefined){
      return 'disabled'
    } else {
      return '';
    }
  },
  checkedProp : function (){
    var responseData = Session.get('responseData');
    if(!!responseData && ("choice_" + Questions.findOne().choices.indexOf(this.toString())) === responseData.userChoiceID){
      return {'checked': 'checked'};
    } else {
      return '';
    }
  },
  tagColor: function(){
    //#rrggbb
    //0123456
    var hexColor = Tags.findOne().color;
    var r = parseInt(hexColor.substr(1,2),16);
    var g = parseInt(hexColor.substr(3,2),16);
    var b = parseInt(hexColor.substr(5,2),16);
    
    return "rgba(" + r + "," + g + "," + b + "," + 0.3 + ")"
  }
});