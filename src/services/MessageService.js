class MessageService {
  static prepareMessages (data) {
    let messages = []

    data.message.forEach (function (message) {
      messages.push ({ author: 'them', ...message.message })
    });

    return messages
  }
}
export default MessageService
