import React from 'react'
import PropTypes from 'prop-types'

import Launcher from './Launcher'
import ChatbotService from '../services/ChatbotService'


class Chat extends React.Component {
  chatbot = null
  state = { messageList: [] }

  constructor(props) {
    super(props)

    if ('chatbotConfig' in props) {
      const { chatbotConfig: { host, webhook } } = props
      this.chatbot = new ChatbotService(host, webhook)
    }
  }

  async onMessageWasSent (message) {
    let data = null
    const { messageList } = this.state

    if (this.chatbot) {
      data = await this.chatbot.fetchResponse(message)
    }

    this.setState({
      messageList: [
        ...messageList,
        message,
        ...(data ? [data] : [])
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
  theme: PropTypes.shape({
    brandColor: PropTypes.string,
  }),
  agentProfile: PropTypes.shape({
    teamName: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  chatbotConfig: PropTypes.shape({
    host: PropTypes.string,
    webhook: PropTypes.string,
  }),
  showEmoji: PropTypes.bool,
}

Chat.defaultProps = {
  theme: {
    brandColor: 'magenta'
  },
  agentProfile: {
    teamName: 'Chat title',
    imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
  },
  showEmoji: true,
}

export default Chat
