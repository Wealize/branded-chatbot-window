class ChatbotService {
  constructor (endpoint) {
    this.endpoint = endpoint
  }

  fetchResponse (text) {
    return fetch(this.endpoint, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    }).then(response => {
      return response.json()
    })
  }
}

export default ChatbotService
