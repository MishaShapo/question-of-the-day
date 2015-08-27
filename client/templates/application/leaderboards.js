Template.leaderboards.onCreated(function(){
  var self = this;
  self.ready = new ReactiveVar();
  self.sortSpecifier = new ReactiveVar();
  self.sortSpecifier.set({
    sortName: 'totalQuestionsAnswered',
    tagIndex: -1
  });
  self.autorun(function() {
    var specifier = self.sortSpecifier.get();
    var topTenHandle = QuestionSubs.subscribe('topTenUsers',specifier.sortName,specifier.tagIndex);
    var tagHandle = LongSubs.subscribe('tags');
    self.ready.set(tagHandle.ready() && topTenHandle.ready());
  });

});

Template.leaderboards.helpers({
  tagOptions: function(){
    var options = [{label:'Total Questions Answered', value: 'totalQuestionsAnswered'}];
    Tags.find().forEach(function(cur){
      options.push({label: cur.name, value: cur.name});
    });
    return options;
  },
  topTen : function() {
    var topTen = Meteor.users.find().fetch();
    console.log('leaderboards Top 10')
    console.log(topTen);
  }
});

Template.leaderboards.events({
  'change form' : function(e){
    console.log('leaderboard change form');
    console.log(e.target.value);
    var tagIndex = null;
    var tags = Tags.find().fetch();
    console.log('tags')
    console.log(tags);
    for(var i = 0; i < tags.length; i++){
      if(tags[i].name === e.target.value){
        tagIndex = i;
        break;
      }
    }
    console.log('value and index')
    console.log(e.target.value)
    console.log(tagIndex);
    Template.instance().sortSpecifier.set({
      sortName: e.target.value,
      tagIndex: tagIndex
    });
  }
});