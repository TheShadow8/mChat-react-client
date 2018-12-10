import React, { Component } from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import Login from './components/Landing/Login';
import Register from './components/Landing/Register';
class App extends Component {
  render() {
    const client = new ApolloClient({
      uri: 'http://localhost:8088/graphql'
    });

    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Route path="/" exact component={Login} />
            <Route path="/register" component={Register} />
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
