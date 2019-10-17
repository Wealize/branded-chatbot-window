class MessageService {
  static prepareMessages (messages) {
    return messages.map(message => ({ author: 'them', ...message }))
  }
}
export default MessageService
