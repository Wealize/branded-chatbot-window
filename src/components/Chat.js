import React from 'react'
import PropTypes from 'prop-types'

import { v4 as uuidv4 } from 'uuid'

import Launcher from './Launcher'
import MessageService from '../services/MessageService'
import { MESSAGE_LIST, USER_ID } from '../constants/storage'
import { LocalStorageService, CookieService } from '../services/StorageService'


class Chat extends React.Component {
  constructor (props) {
    super(props)
    const {
      chatbotEndpoint,
      userTimeout
    } = props

    this.state = {
      messageList: [],
      newMessagesCount: 0
    }

    this.cookieManager = new CookieService()

    this.initialiseUserId(userTimeout)
    this.initialiseMessageList()
    this.initialiseWebsocket(chatbotEndpoint)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.messageList !== prevState.messageList || this.state.newMessagesCount !== prevState.newMessagesCount) {
      let conversation = {
        userId: this.userId,
        messages: this.state.messageList,
        newMessagesCount: this.state.newMessagesCount
      }

      LocalStorageService.setItem(MESSAGE_LIST, conversation)
    }
  }

  initialiseWebsocket (chatbotEndpoint) {
    this.socket = new WebSocket(`${chatbotEndpoint}?user_id=${this.userId}`)
    this.socket.onmessage = (event => this.onMessage(event))
    this.socket.onclose = (() => {})
    this.socket.onopen = (() => {})
  }

  initialiseMessageList () {
    let conversation = LocalStorageService.getItem(MESSAGE_LIST)

    if (!conversation) {
      this.state.messageList = []
    } else if (conversation.userId !== this.userId){
      LocalStorageService.removeItem(MESSAGE_LIST)
    } else {
      this.state.messageList = conversation.messages
      this.state.newMessagesCount = conversation.newMessagesCount || 0
    }
  }

  initialiseUserId (userTimeout) {
    let userId = this.cookieManager.getCookie(USER_ID)

    if (!userId) {
      userId = uuidv4()
      this.cookieManager.setCookie(
        USER_ID,
        userId,
        userTimeout
      )
    }

    this.userId = userId
  }

  sendMessage (message) {
    this.socket.send(message)
  }

  onMessage (event) {
    const { messageList, newMessagesCount } = this.state

    const preparedMessages = MessageService.prepareMessages(JSON.parse(event.data))

    this.setState({
      messageList: [
        ...messageList,
        ...preparedMessages
      ],
      newMessagesCount: preparedMessages.length > 1 ? (newMessagesCount === 0 ? preparedMessages.length - 1: newMessagesCount + preparedMessages.length) : (newMessagesCount === 0 ? 0 : newMessagesCount + 1)
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
      newMessagesCount: 0
    })
  }

  async onFilesSelected (files) {
    const file = files[0]
    const { messageList } = this.state
    const message = {
      author: 'me',
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
      newMessagesCount: 0
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
        is_chatbot: true,
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
              is_chatbot: true,
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

  _handleReadMessages () {
    this.setState({
      newMessagesCount: 0
    })
  }

  render () {
    const {
      agentProfile,
      hideUserInputWithQuickReplies,
      isOpen,
      isWebView,
      showEmoji,
      showFileIcon,
      verticalQuickReplies
    } = this.props
    const { messageList, newMessagesCount } = this.state

    return (
      <Launcher
        agentProfile={agentProfile}
        handleReadMessages={this._handleReadMessages.bind(this)}
        hideUserInputWithQuickReplies={hideUserInputWithQuickReplies}
        isOpen={isOpen}
        isWebView={isWebView}
        messageList={messageList}
        newMessagesCount={newMessagesCount}
        onFilesSelected={this.onFilesSelected.bind(this)}
        onMessageWasSent={this.onMessageWasSent.bind(this)}
        showEmoji={showEmoji}
        showFileIcon={showFileIcon}
        showStartButton={this.showStartButton.bind(this)}
        showWelcomeMessage={this.showWelcomeMessage.bind(this)}
        verticalQuickReplies={verticalQuickReplies}
      />
    )
  }
}

Chat.propTypes = {
  agentProfile: PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    teamExplanation: PropTypes.string
  }).isRequired,
  chatbotEndpoint: PropTypes.string.isRequired,
  hideUserInputWithQuickReplies: PropTypes.bool,
  isOpen: PropTypes.bool,
  isWebView: PropTypes.bool,
  showEmoji: PropTypes.bool,
  showFileIcon: PropTypes.bool,
  startButton: PropTypes.string,
  userTimeout: PropTypes.number,
  verticalQuickReplies: PropTypes.bool,
  welcomeMessage: PropTypes.string,
}

Chat.defaultProps = {
  hideUserInputWithQuickReplies: false,
  isOpen: false,
  isWebView: false,
  showEmoji: true,
  showFileIcon: true,
  userTimeout: 2147483647,
  verticalQuickReplies: false
}

export default Chat
