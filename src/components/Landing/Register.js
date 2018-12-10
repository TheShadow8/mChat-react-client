import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import './Landing.css';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

export class Register extends Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    password2: '',
    passwordError: ''
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
      password2Error: ''
    });

    const { username, email, password, password2 } = this.state;
    const response = await this.props.mutate({
      variables: { username, email, password, password2 }
    });

    const { sucess, errors } = response.data.register;

    if (sucess) {
      this.props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      this.setState(err);
    }

    console.log(response);
  };

  render() {
    const { username, email, password, password2, usernameError, emailError, passwordError, password2Error } = this.state;

    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    if (password2Error) {
      errorList.push(password2Error);
    }

    return (
      <div className="login-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              <Image src="/favicon.png" />
              Sign up a new account
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                  value={username}
                  onChange={this.onChange}
                  error={!!usernameError}
                />
                <Form.Input
                  name="email"
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address"
                  value={email}
                  onChange={this.onChange}
                  error={!!emailError}
                />
                <Form.Input
                  name="password"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={this.onChange}
                  error={!!passwordError}
                />
                <Form.Input
                  name="password2"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password Confirmation"
                  value={password2}
                  type="password"
                  onChange={this.onChange}
                  error={!!password2Error}
                />

                <Button color="teal" fluid size="large" onClick={this.onSubmit}>
                  Sign up
                </Button>
              </Segment>
            </Form>
            <Message>
              Already had an user ? <Link to="/">Log in</Link>
            </Message>
            {usernameError || emailError || passwordError || password2Error ? (
              <Message error header="There was some errors with your submission" list={errorList} />
            ) : null}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!, $password2: String!) {
    register(username: $username, email: $email, password: $password, password2: $password2) {
      sucess
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerMutation)(Register);
