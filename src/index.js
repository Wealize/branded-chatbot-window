// import React from 'react'
// import ReactDOM from 'react-dom'

// import Chat from './components/Chat'

// ReactDOM.render(
//   <Chat 
//     chatbotEndpoint='wss://cp.eu.ngrok.io/webchat/2bb31158-ff95-44c2-9f45-1d0f4b5ab02b/'
//     welcomeMessage='¡Bienvenido al webchat de Tec!'
//     startButton='¡Hola!'
//     agentProfile={{
//       teamName: 'TEC',
//       imageUrl: 'https://tnpnlu-assets.s3.eu-central-1.amazonaws.com/Logo_TEC.png'
//     }}
//     theme={{
//       brandColor: 'blue'
//     }}
//     userTimeout={3600}
//     isWebView={true}
//   />,
//   document.getElementById('chatbotContainer')
// )
import Chat from './components/Chat';

export { Chat };
