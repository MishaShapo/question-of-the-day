QuestionSubs = new SubsManager({
  cacheLimit: 10,
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


