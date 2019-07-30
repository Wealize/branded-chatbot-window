class ChatbotService {
  constructor (host, webhookId) {
    this.endpoint = `https://${host}/webhook_web/${webhookId}/`
  }

  fetchResponse (text) {
    return fetch(this.endpoint, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({ message: text })
    }).then(response => {
      return response.json()
    })
  }
}

export default ChatbotService
