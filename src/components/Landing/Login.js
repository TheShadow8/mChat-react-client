import React from 'react';
import { Link } from 'react-router-dom';
import { withFormik } from 'formik';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import './Landing.css';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

function Login({ handleChange, handleSubmit, values, isSubmitting, errors }) {
  const errorCheck = {};
  const errorList = [];

  // Check and push error tho errorList if have errors
  if (errors.length > 0) {
    for (const error of errors) {
      errorList.push(error.message);
      errorCheck[error.path] = true;
    }
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
                value={values.email}
                onChange={handleChange}
                error={errorCheck.email}
              />
              <Form.Input
                name="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={errorCheck.password}
              />

              <Button
                color="teal"
                fluid
                size="large"
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                Log in
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us ? <Link to="/register">Sign up</Link>
          </Message>
          {errorList.length > 0 ? (
            <Message error header="There was some errors with your submission" list={errorList} />
          ) : null}
        </Grid.Column>
      </Grid>
    </div>
  );
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

export default compose(
  graphql(loginMutation),

  withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
      const { email, password } = values;

      const response = await props.mutate({
        variables: { email, password }
      });

      const { sucess, errors, token, refreshToken } = response.data.login;

      console.log(response);

      if (sucess) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        props.history.push('/');
      } else {
        setErrors(errors);
      }
      setSubmitting(false);
    }
  })
)(Login);
