import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import './Landing.css';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

export class Login extends Component {
  state = {
    email: '',
    emailError: '',
    password: '',
    passwordError: ''
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    this.setState({
      emailError: '',
      passwordError: ''
    });

    const { email, password } = this.state;
    const response = await this.props.mutate({
      variables: { email, password }
    });

    const { sucess, errors, token, refreshToken } = response.data.login;

    if (sucess) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
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
    const { email, password, emailError, passwordError } = this.state;

    const errorList = [];

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <div className="login-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              <Image src="/favicon.png" />
              Log-in to your account
            </Header>
            <Form size="large">
              <Segment stacked>
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

                <Button color="teal" fluid size="large" onClick={this.onSubmit}>
                  Log in
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us ? <Link to="/register">Sign up</Link>
            </Message>
            {emailError || passwordError ? (
              <Message error header="There was some errors with your submission" list={errorList} />
            ) : null}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      sucess
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(Login);
