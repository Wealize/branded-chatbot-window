import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie';

import Launcher from './Launcher'
import MessageService from '../services/MessageService'



const Chat = (props) => {
  const {
    theme,
    agentProfile,
    showEmoji,
    showFileIcon,
    chatbotEndpoint,
    welcomeMessage,
    startButton
  } = props

  const [messageList, setMessageList] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    let user_id = getCookie('coloqio-webchat-user-id')

    if (!user_id){
      uuid = generateUniqueId()
      user_id = setCookie(
        'coloqio-webchat-user-id',
        uuid
      )
    }

    connection = new WebSocket(
      `${chatbotEndpoint}?user_id=${user_id}`,
    )
    connection.onopen = onOpen()
    connection.onmessage = (event => onMessage(event))
    connection.onclose = onClose()

    setSocket(connection)
  }, [])

  const generateUniqueId = () => {
    const uuid = require('uuid/v4')
    return uuid()
  }

  const getCookie = (cookieName) => {
    const cookies = new Cookies()
    return cookies.get(cookieName)
  }

  const setCookie = (cookieName, cookieValue) => {
    const cookies = new Cookies()
    cookies.set(cookieName, cookieValue, { path: '/' })

    return cookieValue
  }

  const onOpen = () => {}

  const onClose = () => {}

  const sendMessage = (message) => {
    socket.send(message)
  }

  const onMessage = (event) => {
    setMessageList(
      [
        ...messageList,
        ...MessageService.prepareMessages([JSON.parse(event.data)])
      ]
    )
  }

  async const onMessageWasSent = (message) => {
    const {
      data: { text, value }
    } = message

    sendMessage(value || text)

    setMessageList(
      [
        ...messageList,
        message
      ]
    )
  }

  async const onFilesSelected = (files) => {
    const file = files[0]
    const message = {
      author: 'them',
      type: 'file',
      data: {
        fileName: file.name
      }
    }

    this.sendMessage(file)

    setMessageList(
      [
        ...messageList,
        message
      ]
    )
  }

  async const showWelcomeMessage = () => {
    if (welcomeMessage && !startButton) {
      const message = {
        type: 'text',
        author: 'them',
        data: {text: welcomeMessage}
      }

      setMessageList(
        [
          ...messageList,
          message
        ]
      )
    }

  }

  async const showStartButton = () => {
    if (startButton) {
      this.setState({
        messageList: [
          ...messageList,
          ...MessageService.prepareMessages([
            {
              author: 'them',
              type: 'text',
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

  return (
    <Launcher
      theme={theme}
      agentProfile={agentProfile}
      showEmoji={showEmoji}
      showFileIcon={showFileIcon}
      onMessageWasSent={onMessageWasSent}
      onFilesSelected={onFilesSelected}
      showWelcomeMessage={showWelcomeMessage}
      showStartButton={showStartButton}
      messageList={messageList}
    />
  )
}

Chat.propTypes = {
  chatbotEndpoint: PropTypes.string.isRequired,
  welcomeMessage: PropTypes.string,
  startButton: PropTypes.string,
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
