import React from 'react'
import ReactDOM from 'react-dom'

import Chat from './components/Chat'

ReactDOM.render(
  <Chat {...(window.chatProps)}/>,
  document.getElementById('chatbotContainer')
)
