Template.afArrayField_choices.helpers({
  index : function(){
    return parseInt(this.name.charAt(this.name.length-1)) + 1 + "";
  },
  amICorrectChoice : function() {
    var choice = AutoForm.getFieldValue('correctChoice');
    return (choice === (this.index)) ? 'correct-choice' : ''
  }
});
