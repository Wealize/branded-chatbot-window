import React from 'react'
import PropTypes from 'prop-types'

import Launcher from './Launcher'
import MessageService from '../services/MessageService'

class Chat extends React.Component {
  chatbot = null
  state = { messageList: [] }

  constructor(props) {
    const { chatbotEndpoint } = props

    super(props)

    this.socket = new WebSocket(chatbotEndpoint);

    this.socket.onmessage = (event => this.onMessage(event))
    this.socket.onclose = this.onClose()
    this.socket.onopen = this.onOpen()
  }

  onOpen () {
    console.log('websocket open')
  }

  onClose () {
    console.log('websocket close')
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
      data: { text },
    } = message

    this.sendMessage(text)

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
        messageList={messageList}
      />
    )
  }
}

Chat.propTypes = {
  chatbotEndpoint: PropTypes.string.isRequired,
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
