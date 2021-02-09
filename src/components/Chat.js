import React from 'react'
import PropTypes from 'prop-types'

import Launcher from './Launcher'
import MessageService from '../services/MessageService'
import { LocalStorageService, CookieService } from '../services/StorageService'


class Chat extends React.Component {
  constructor (props) {
    super(props)
    const { chatbotEndpoint } = props

    this.state = {
      messageList: []
    }

    this.cookieManager = new CookieService()

    this.initialiseUserId()
    this.initialiseMessageList()
    this.initialiseWebsocket(chatbotEndpoint)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.messageList !== prevState.messageList) {
      let conversation = {
        userId: this.userId,
        messages: this.state.messageList
      }

      LocalStorageService.setItem('message-list', conversation)
    }
  }

  initialiseWebsocket (chatbotEndpoint) {
    this.socket = new WebSocket(`${chatbotEndpoint}?user_id=${this.userId}`)
    this.socket.onmessage = (event => this.onMessage(event))
    this.socket.onclose = (() => {})
    this.socket.onopen = (() => {})
  }

  initialiseMessageList () {
    let conversation = LocalStorageService.getItem('message-list')

    if (!conversation) {
      this.state.messageList = []
    } else if (conversation.userId !== this.userId){
      LocalStorageService.removeItem('message-list')
    } else {
      this.state.messageList = conversation.messages
    }
  }

  initialiseUserId () {
    let userId = this.cookieManager.getCookie('coloqio-webchat-user-id')

    if (!userId) {
      const uuid = require('uuid/v4')
      userId = uuid()
      this.cookieManager.setCookie(
        'coloqio-webchat-user-id',
        userId,
        60 * 60 * 24
      )
    }

    this.userId = userId
  }

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
