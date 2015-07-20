var subs = new SubsManager({
  cacheLimit: 5,
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
  waitOn: function() {return [subs.subscribe('questions')];}
});

Router.route('/', {name: 'question'});



