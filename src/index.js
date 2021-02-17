import React from 'react'
import ReactDOM from 'react-dom'

import Chat from './components/Chat'

ReactDOM.render(
  <Chat {...({
    chatbotEndpoint: 'ws://localhost:8000/webchat/0dd46ed6-1fe9-4579-ae01-b254214b594d/',
    welcomeMessage: '¡Bienvenido al webchat!',
    startButton: '¡Hola!',
    agentProfile: {
        teamName: 'My team name',
        imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
    },
    theme: {
        brandColor: 'blue'
    }
})}/>,
  document.getElementById('chatbotContainer')
)
