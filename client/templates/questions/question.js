Template.question.events({
  'submit form': function(e){
    e.preventDefault();
    
    var answer = $(e.target).find('input:checked ~ label').text();
    if(null == answer){
      return throwError('Please select an answer');
    }
    
    $('.answerChoice input:radio').attr('disabled',true);
    
    console.log('answer : ' + answer);
    Meteor.call('validateAnswer',answer);
  }
});