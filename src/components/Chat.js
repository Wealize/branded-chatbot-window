import React from 'react'
import PropTypes from 'prop-types'
import { uuid } from 'uuid/v4'

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

    this.cookieManager = CookieService()

    let userId = this.getUserId()
    this.initialiseMessageList(userId)
    this.initialiseWebsocket(chatbotEndpoint, userId)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.messageList !== prevState.messageList) {
      LocalStorageService.setItem('message-list', this.state.messageList)
    }
  }

  initialiseWebsocket (chatbotEndpoint, userId) {
    this.socket = new WebSocket(`${chatbotEndpoint}?user_id=${userId}`)
    this.socket.onmessage = (event => this.onMessage(event))
    this.socket.onclose = (() => {})
    this.socket.onopen = (() => {})
  }

  initialiseMessageList (userId) {
    let conversation = LocalStorageService.getItem('message-list')

    if (!conversation) {
      this.state.messageList = []
    } else if (conversation.userId !== userId){
      LocalStorageService.removeItem('message-list')
    } else {
      this.state.messageList = conversation.messages
    }
  }

  getUserId () {
    let userId = this.cookieManager.getCookie('coloqio-webchat-user-id')

    if (!userId) {
      userId = uuid()
      this.cookieManager.setCookie(
        'coloqio-webchat-user-id',
        userId,
        60 * 60 * 24
      )
    }

    return userId
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
