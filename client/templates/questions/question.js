Template.question.onRendered(function (){
  if(Session.get('alreadyAnswered')){
    $('.answerChoice input:radio').attr('disabled',true);
    $('button[form="response-form"]').attr('disabled',true);
  }
});

Template.question.events({
  'submit form': function(e){
    e.preventDefault();
    
    var answer = $(e.target).find('input:checked ~ label').text();
    if(null == answer){
      return throwError('Please select an answer');
    }
    
    
    
    console.log('answer : ' + answer);
    Meteor.call('validateAnswer',answer, function(error, result){
      if(!error){
        $('.answerChoice input:radio').attr('disabled',true);
        $('button[form="response-form"]').attr('disabled',true);
        Session.setDefaultPersistent('alreadyAnswered',true);
      }
      console.log("result : " + result);
    });
  }
});