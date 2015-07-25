AdminConfig = {
  name: 'Misha's Question of the Day'',
  adminEmails: ['misha.shapo98@gmail.com'],
  collections: {
    Questions: {
      icon: 'question-circle',
      tableColumns: [
        {label: 'Question Text', name:'text'},
        {label: 'Choices', name:'choices'}
      ]
    }
  },
  userSchema: Schemas.User
}