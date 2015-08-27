QuestionSubs = new SubsManager({
  cacheLimit: 100,
  expireIn: 1440
});

LongSubs = new SubsManager({
  cacheLimit: 999,
  expireIn: 9999
});


FlowRouter.route('/',{
  name: 'question',
  action: function (){
    BlazeLayout.render('layout',{content: 'question'});
  }
});

FlowRouter.route('/myProfile',{
  name:'myProfile',
  action: function(){
    BlazeLayout.render('layout',{content:'myProfile'});
  }
});

FlowRouter.route('/leaderboards',{
  name:'leaderboards',
  action: function(){
    BlazeLayout.render('layout',{content:'leaderboards'});
  }
});

FlowRouter.route('/suggestAQuestion',{
  name:'suggestAQuestion',
  action: function(){
    BlazeLayout.render('layout',{content:'suggestAQuestion'});
  }
});

FlowRouter.route('/about_contact',{
  name:'aboutContact',
  action: function(){
    BlazeLayout.render('layout',{content:'aboutContact'});
  }
});

FlowRouter.route('/successfulSuggestion',{
  name:'successfulSuggestion',
  action: function(){
    BlazeLayout.render('layout',{content:'successfulSuggestion'});
  }
});

FlowRouter.route('/failedSuggestion',{
  name:'failedSuggestion',
  action: function(){
    BlazeLayout.render('layout',{content:'failedSuggestion'});
  }
});

FlowRouter.route('/accessDenied',{
  name: 'accessDenied',
  action: function(){
    BlazeLayout.render('layout',{content:'accessDenied'});
  }
});

var adminRoutes = FlowRouter.group({
  prefix: '/admin'
});

adminRoutes.route('/suggestionList', {
  name: 'suggestionList',
  subscriptions: function(){
    this.register('suggestedQuestions',Meteor.subscribe('suggestedQuestions'));
  },
  action: function(){BlazeLayout.render('layout',{content:'suggestionList'})}
});

adminRoutes.route('/suggestion/:suggestionId', {
  name: 'singleSuggestion',
  subscriptions: function(params) {
    this.register('suggestion', Meteor.subscribe('singleSuggestion', params.suggestionId));
  },
  action: function(){BlazeLayout.render('layout',{content:'singleSuggestion'});}
})

FlowRouter.notFound = {
  
  action: function(){
    BlazeLayout.render('layout',{content:'notFound'});
  }
}

var isLoggedIn = function(context,redirect) {
  if(!Meteor.user()){
    if(Meteor.loggingIn()){
      BlazeLayout.render('layout',{content:'loading'}); 
    } else{
      redirect('/accessDenied');
    }
  }
}

var isAdmin = function(context,redirect) {
  if(Meteor.user() && Roles.userIsInRole(Meteor.user(),['admin'])){
    if(Meteor.loggingIn()){
      BlazeLayout.render('layout',{content:'loading'}); 
    } 
  } else {
      redirect('/accessDenied');
  }
}

FlowRouter.triggers.enter([isLoggedIn], {only:['suggestAQuestion','myProfile']})
FlowRouter.triggers.enter([isAdmin], {only:['suggestionList','singleSuggestion']})


