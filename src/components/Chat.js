import React from 'react';
import PropTypes from 'prop-types';

import Launcher from './Launcher';
import ChatbotService from '../services/ChatbotService';

class Chat extends React.Component {
  chatbot = null;
  state = {messageList: []};

  constructor(props) {
    const {chatbotEndpoint} = props;

    super(props);

    this.chatbot = new ChatbotService(chatbotEndpoint);
  }

  async onMessageWasSent(message) {
    const {messageList} = this.state;
    const {
      data: {text},
    } = message;

    const data = await this.chatbot.fetchResponse(text);

    this.setState({
      messageList: [
        ...messageList,
        message,
        ...(data && data.message ? this.getMessages(data) : []),
      ],
    });
  }

  getMessages(data) {
    let messages = [];

    data.message.forEach(function(message) {
      messages.push({author: 'them', ...message.message});
    });

    return messages;
  }

  render() {
    const {theme, agentProfile, showEmoji} = this.props;
    const {messageList} = this.state;

    return (
      <Launcher
        theme={theme}
        agentProfile={agentProfile}
        showEmoji={showEmoji}
        onMessageWasSent={this.onMessageWasSent.bind(this)}
        messageList={messageList}
      />
    );
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
};

Chat.defaultProps = {
  showEmoji: true,
  theme: {},
};

export default Chat;
