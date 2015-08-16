Template.afArrayField_choices.helpers({
  index : function(){
    return parseInt(this.name.charAt(this.name.length-1)) + 1 + "";
  }
});
