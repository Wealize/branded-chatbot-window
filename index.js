import React from 'react'
import ReactDOM from 'react-dom'

import Chat from './src/components/Chat'

ReactDOM.render(
  <Chat {...(window.chatbotSettings)}/>,
  document.getElementById('chatbotContainer')
)
