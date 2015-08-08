if(Tags.find().count() === 0){
 var tags = [
    {name: 'Math', correct: 0, wrong: 0},
    {name:'Science', correct: 0, wrong: 0},
    {name: 'History', correct: 0, wrong: 0},
    {name:'Literature', correct: 0, wrong: 0}
  ];
  for(var i = 0; i < tags.length; i++){
    Tags.insert(tags[i]);
  }
  console.log('added 4 tags');
  console.log('Tags.count : ' + Tags.find().count());
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
    date: new Date().toDateString(),
    tag: 'History'
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
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toDateString(),
    tag: 'Science'
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
    date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2).toDateString(),
    tag: 'Literature' 
  });
  console.log('added 3 questions');
  console.log('Questions.count : ' +  Questions.find().count());
}