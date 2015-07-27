if(Tags.find().count() === 0){
 var tags = [
    {name: 'Math'},
    {name:'Science'},
    {name: 'History'},
    {name:'Literature'}
  ];
  for(var i = 0; i < tags.length; i++){
    Tags.insert(tags[i],{modifier: true});
  }
}

if(Questions.find().count() === 0){
  Questions.insert({
    text: 'What is the capitol of the US?',
    choices: [
      'Chicago',
      'Houston',
      'Washington D.C.',
      'New York City'
    ],
    correctChoice: 2,
    date: new Date().toDateString()
  },{modifier: true});
  
  Questions.insert({
    text: 'Who invented the light bulb?',
    choices: [
      'Abraham Lincoln',
      'Charles Darwin',
      'Liam Neeson',
      'Thomas Edison'
    ],
    correctChoice: 3,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toDateString()
  },{modifier: true});
  
  Questions.insert({
    text: "What is the vlogbrother's salutation?",
    choices: [
      'Hasta la vista, baby',
      'DFTBA',
      'Hi',
      'Take care. Bye now.'
    ],
    correctChoice: 1,
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2).toDateString()
  },{modifier: true});
  console.log('added 3 questions');
  console.log('Questions.count : ' +  Questions.find().count());
}