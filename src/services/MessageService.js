class MessageService {
  static prepareMessages (message) {
    return message.map(message => ({ author: 'them', ...message.message }))
  }
}
export default MessageService
