import React, {Component} from 'react'
import MessageList from './MessageList.jsx'
import ChatBar from './ChatBar.jsx'
// import WebSocket from 'ws'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      oldUsername: null,
      currentUser: {name: 'Anonymo 0'},
      messages: [],
      connectedUsers: 0
    }
  }

  render() {
    return (
      <div>
        <nav className='navbar'>
          <a href='/' className='navbar-brand'>Slick</a>
          <span className='connectedUsers'>
            {this.connectedUsers()}
          </span>
        </nav>
        <MessageList
          messages={this.state.messages}/>
        <ChatBar
          sendMessage={this.sendMessage}
          username={this.state.currentUser.name}
          oldUsername={this.state.oldUsername}
          setUsername={this.setUsername}
        />
      </div>
    )
  }

  connectedUsers() {
    const users = this.state.connectedUsers
    if (users > 1) {
      return `${users} users currently connected`
    } else {
      return `Just you are here ;(`
    }
  }

  componentDidMount() {
    // Connect to websocket server
    this.socket = new WebSocket('ws://localhost:3001')
    // Get messages upon connecting to server
    this.socket.onopen = e => {
      this.getMessagesFromServer()
    }
  }

  sendMessage = (username, content) => {
    const oldUsername = this.state.oldUsername
    const message = {
      oldUsername, username, content }

    // Send stringified message object to server
    this.socket.send(JSON.stringify(message))
    getMessagesFromServer()
  }

  setUsername = (oldUsername, newUsername) => {
    // Need to check if old because is called multiple times
    if (newUsername) {
      if (newUsername !== oldUsername) {
        this.setState({ oldUsername })
      }
      const currentUser = { name: newUsername }
      this.setState({ currentUser })
    }
  }

  getMessagesFromServer() {
    this.socket.onmessage = e => {
      // Parse strinified message object from server
      const msg = JSON.parse(e.data)

      // Check if message or number of connected users
      // Note: This implementation isn't the greatest,
      // but I'm extremely limited on time right now.

      if ( Number.isInteger(msg) ) {
        const connectedUsers = msg
        this.setState({ connectedUsers })
      } else {
        const oldUsername = null
        this.setState({oldUsername})

        // Append message object to messages array
        const messages = this.state.messages.concat(msg)

        this.setState({messages})
      }
    }
  }

  componentWillUnmount() {
    this.socket.close()
  }
}
export default App
