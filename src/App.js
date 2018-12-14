import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import client from './apollo';

import PrivateRoute from './components/Utils/PrivateRoute';
import Login from './components/Landing/Login';
import Register from './components/Landing/Register';
import CreateTeam from './components/Landing/CreateTeam';
import ChatRoom from './components/ChatRoom/ChatRoom';

class App extends Component {
  render() {
    const Home = () => (
      <div>
        <Link to="/chat-room"> ChatRoom </Link>{' '}
      </div>
    );

    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <PrivateRoute path="/" exact component={Home} />

            <PrivateRoute path="/chat-room/:teamId?/:channelId?" component={ChatRoom} />
            <PrivateRoute path="/create-team" exact component={CreateTeam} />
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
