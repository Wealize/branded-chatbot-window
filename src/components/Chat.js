import React from 'react'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie';

import Launcher from './Launcher'
import MessageService from '../services/MessageService'

class Chat extends React.Component {
  chatbot = null
  state = { messageList: [] }

  constructor(props) {
    const { chatbotEndpoint } = props

    super(props)

    let user_id = this.getCookie()

    if (!user_id){
      user_id = this.setCookie()
    }

    this.socket = new WebSocket(`${chatbotEndpoint}?user_id=${user_id}`)

    this.socket.onmessage = (event => this.onMessage(event))
    this.socket.onclose = this.onClose()
    this.socket.onopen = this.onOpen()

  }

  getCookie () {
    const cookies = new Cookies();
    return cookies.get('coloqio-webchat-user-id')
  }

  setCookie () {
    const uuid = require('uuid/v4')
    const cookies = new Cookies()
    const user_uuid = uuid()
    cookies.set('coloqio-webchat-user-id', user_uuid, { path: '/' })
    return user_uuid
  }

  onOpen () {}

  onClose () {}

  sendMessage (message) {
      this.socket.send(message)
  }

  onMessage (event) {
    const { messageList } = this.state

    this.setState({
      messageList: [
        ...messageList,
        ...MessageService.prepareMessages([JSON.parse(event.data)])
      ],
    })
  };

  async onMessageWasSent (message) {
    const { messageList } = this.state
    const {
      data: { text, value },
    } = message

    this.sendMessage(value || text)

    this.setState({
      messageList: [
        ...messageList,
        message
      ],
    })
  }

  async onFilesSelected (files) {
    const file = files[0]
    const { messageList } = this.state
    const message = {
      author: 'them',
      type: 'file',
      data: {
        fileName: file.name
      }
    }

    this.sendMessage(file)

    this.setState({
      messageList: [
        ...messageList,
        message
      ],
    })
  }

  async showWelcomeMessage () {
    const welcomeMessage = this.props.welcomeMessage
    const startButton = this.props.startButton
    const { messageList } = this.state

    if(welcomeMessage && !startButton){
      const message = {
        type: 'text',
        author: 'them',
        data: {text: welcomeMessage}
      }

      this.setState({
        messageList: [
          ...messageList,
          message
        ],
      })
    }

  }

  async showStartButton () {
    const welcomeMessage = this.props.welcomeMessage
    const startButton = this.props.startButton
    const { messageList } = this.state

    if (startButton) {
      this.setState({
        messageList: [
          ...messageList,
          ...MessageService.prepareMessages([
            {
              author: 'them',
              type: 'text',
              data: {
                text: welcomeMessage || '¡Bienvenido!'
              },
              quickReplies: [
                {
                  author: 'me',
                  type: 'text',
                  data: {
                    text: startButton,
                    value: 'start'
                  }
                }
              ]
            }
          ])
        ],
      })
    }

  }

  render () {
    const { theme, agentProfile, showEmoji, showFileIcon } = this.props
    const { messageList } = this.state

    return (
      <Launcher
        theme={theme}
        agentProfile={agentProfile}
        showEmoji={showEmoji}
        showFileIcon={showFileIcon}
        onMessageWasSent={this.onMessageWasSent.bind(this)}
        onFilesSelected={this.onFilesSelected.bind(this)}
        showWelcomeMessage={this.showWelcomeMessage.bind(this)}
        showStartButton={this.showStartButton.bind(this)}
        messageList={messageList}
      />
    )
  }
}

Chat.propTypes = {
  chatbotEndpoint: PropTypes.string.isRequired,
  welcomeMessage: PropTypes.string,
  startButton: PropTypes.string,
  agentProfile: PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    brandColor: PropTypes.string,
  }),
  showEmoji: PropTypes.bool,
  showFileIcon: PropTypes.bool,
}

Chat.defaultProps = {
  showEmoji: true,
  showFileIcon: true,
  theme: {},
}

export default Chat
