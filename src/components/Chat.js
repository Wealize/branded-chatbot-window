import React from 'react'
import PropTypes from 'prop-types'

import Launcher from './Launcher'
import ChatbotService from '../services/ChatbotService'


class Chat extends React.Component {
  chatbot = null
  state = { messageList: [] }

  constructor(props) {
    const { host, webhook } = props

    super(props)

    this.chatbot = new ChatbotService(host, webhook)
  }

  async onMessageWasSent (message) {
    const { messageList } = this.state

    const data = await this.chatbot.fetchResponse(message)

    this.setState({
      messageList: [
        ...messageList,
        message,
        ...(data && data.message
          ? [data.message]
          : []
        )
      ],
    })
  }

  render () {
    const { theme, agentProfile, showEmoji } = this.props
    const { messageList } = this.state

    return (
      <Launcher
        theme={theme}
        agentProfile={agentProfile}
        showEmoji={showEmoji}
        onMessageWasSent={this.onMessageWasSent.bind(this)}
        messageList={messageList}
      />
    )
  }
}

Chat.propTypes = {
  host: PropTypes.string.isRequired,
  webhook: PropTypes.string.isRequired,
  agentProfile: PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    brandColor: PropTypes.string,
  }),
  showEmoji: PropTypes.bool,
}

Chat.defaultProps = {
  showEmoji: true,
  theme: {},
}

export default Chat
