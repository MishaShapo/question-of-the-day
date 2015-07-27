var subs = new SubsManager({
  cacheLimit: 25,
  expireIn: 1440
});

var requireLogin = function(){
  if(!Meteor.user()){
    this.render('accessDenied');
  } else{
    this.next();
  }
}

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {return subs.subscribe('questions');}
});

Router.route('/', {
  name: 'question',
  data: function(){ return Questions.findOne();}
});



