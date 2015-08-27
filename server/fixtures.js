if(Tags.find().count() === 0){
 var tags = [
    {name: 'Math', correct: 0, wrong: 0, color: "#3182bd"},
    {name:'Science', correct: 0, wrong: 0,color:"#ad494a"},
    {name: 'History', correct: 0, wrong: 0,color:"#e7ba52"},
    {name:'Literature', correct: 0, wrong: 0,color:"#a55194"}
  ];
  for(var i = 0; i < tags.length; i++){
    Tags.insert(tags[i]);
  }
}

if(Questions.find().count() === 0){
  var curDate = new Date();
  Questions.insert({
    text: 'What is the capitol of the US?',
    choices: [
      'Chicago',
      'Houston',
      'Washington D.C.',
      'New York City'
    ],
    correctChoice: 2,
    date: curDate.toDateString(),
    tag: 'History',
    author: "MishaShapo"
  });
  
  Questions.insert({
    text: 'Who invented the light bulb?',
    choices: [
      'Abraham Lincoln',
      'Charles Darwin',
      'Liam Neeson',
      'Thomas Edison'
    ],
    correctChoice: 3,
    date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 1).toDateString(),
    tag: 'Science',
    author: 'MishaShapo'
  });
  
  Questions.insert({
    text: "What is the vlogbrother's salutation?",
    choices: [
      'Hasta la vista, baby',
      'DFTBA',
      'Hi',
      'Take care. Bye now.'
    ],
    correctChoice: 1,
    date: new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() + 2).toDateString(),
    tag: 'Literature',
    author: 'MishaShapo'
  });
}

if(Meteor.users.find().count() === 0){
  var newId = "";
  for(var i = 0; i < 20; i++){
    var randomId = Random.id();
    newId = Accounts.createUser({
    username: randomId,
    email: randomId + '@gmail.com',
    password: 'password',
    profile: {}
    });
    Meteor.call('giveTags',newId);
  }
  var creator = Accounts.createUser({
    username: 'Admin',
    email: 'admnin@admin.com',
    password: 'password',
    profile: {}
  });
  Meteor.call('giveTags',creator);
  Meteor.call('makeAdmin',creator);
}