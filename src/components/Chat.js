import React from 'react'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie'
import { LZMA as compression } from 'lzma/src/lzma-c'
import { LZMA as decompression } from 'lzma/src/lzma-d'

import Launcher from './Launcher'
import MessageService from '../services/MessageService'

class Chat extends React.Component {
  constructor (props) {
    const { chatbotEndpoint } = props

    super(props)

    this.state = {
      messageList: []
    }

    let messageFromCookie = this.getCookie('message-list')

    if (messageFromCookie) {
      this.state.messageList = messageFromCookie
    }

    let user_id = this.getCookie('coloqio-webchat-user-id')

    if (!user_id) {
      const uuid = require('uuid/v4')
      user_id = this.setCookie(
        'coloqio-webchat-user-id',
        uuid(),
        60 * 60 * 24
      )
    }

    this.socket = new WebSocket(`${chatbotEndpoint}?user_id=${user_id}`)

    this.socket.onmessage = (event => this.onMessage(event))
    this.socket.onclose = this.onClose()
    this.socket.onopen = this.onOpen()
  }

  componentDidUpdate () {
    this.setCookie(
      'message-list',
      this.state.messageList,
      3600
    )

    let compressed_data = compression.compress(JSON.stringify(this.state.messageList), 9)
    console.log(decompression.decompress(compressed_data))
  }

  getCookie (cookieName) {
    const cookies = new Cookies()
    return cookies.get(cookieName)
  }

  setCookie (cookieName, cookieValue, maxAgeSeconds) {
    const cookies = new Cookies()
    cookies.set(
      cookieName,
      cookieValue,
      { path: '/', maxAge: maxAgeSeconds }
    )

    return cookieValue
  }

  onOpen () { }

  onClose () { }

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

    if (welcomeMessage && !startButton) {
      const message = {
        type: 'text',
        author: 'them',
        data: { text: welcomeMessage }
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
    const {
      theme,
      agentProfile,
      showEmoji,
      showFileIcon,
      hideUserInputWithQuickReplies
    } = this.props
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
        hideUserInputWithQuickReplies={hideUserInputWithQuickReplies}
        messageList={messageList}
      />
    )
  }
}

Chat.propTypes = {
  chatbotEndpoint: PropTypes.string.isRequired,
  welcomeMessage: PropTypes.string,
  startButton: PropTypes.string,
  hideUserInputWithQuickReplies: PropTypes.bool,
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
  hideUserInputWithQuickReplies: false,
  theme: {},
}

export default Chat
