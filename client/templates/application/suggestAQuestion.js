Template.suggestAQuestion.onCreated(function(){
  var self = this;
  self.ready = new ReactiveVar();
  self.autorun(function() {
    var tagHandle  = LongSubs.subscribe('tags');
    self.ready.set(tagHandle.ready());
  });
});

Template.suggestAQuestion.helpers({
  tagOptions : function() {
    return Tags.find().map(function(t){
      return {label:t.name,value:t.name}
    });
  },
  ready: function(){
    return Template.instance().ready.get();
  }
})