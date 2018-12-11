import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';

import PrivateRoute from './components/Utils/PrivateRoute';
import Login from './components/Landing/Login';
import Register from './components/Landing/Register';
import ChatRoom from './components/ChatRoom/ChatRoom';
import CreateTeam from './components/ChatRoom/CreateTeam';

const httpLink = createHttpLink({ uri: 'http://localhost:8088/graphql' });

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken')
  }
}));

const afterwareLink = new ApolloLink((operation, forward) => {
  const { headers } = operation.getContext();

  if (headers) {
    const token = headers.get('x-token');
    const refreshToken = headers.get('x-refresh-token');

    if (token) {
      localStorage.setItem('token', token);
    }

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  return forward(operation);
});

const link = afterwareLink.concat(middlewareLink.concat(httpLink));

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />

            <PrivateRoute path="/" exact component={ChatRoom} />
            <PrivateRoute path="/create-team" exact component={CreateTeam} />
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
