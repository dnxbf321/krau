import React from 'react'
import { hot } from 'react-hot-loader'

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return <p>react render here</p>
  }
}

if (module.hot) {
  App = hot(module)(App)
}

export default App
