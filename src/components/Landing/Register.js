import React from 'react';
import { Link } from 'react-router-dom';
import { withFormik } from 'formik';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import './Landing.css';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

function Register({ handleChange, handleSubmit, values, isSubmitting, errors }) {
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
                value={values.username}
                onChange={handleChange}
                error={errorCheck.username}
              />
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
              <Form.Input
                name="password2"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={values.password2}
                type="password"
                onChange={handleChange}
                error={errorCheck.password2}
              />

              <Button
                color="teal"
                fluid
                size="large"
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Segment>
          </Form>
          <Message>
            Already had an user ? <Link to="/">Log in</Link>
          </Message>
          {errorList.length > 0 ? (
            <Message error header="There was some errors with your submission" list={errorList} />
          ) : null}
        </Grid.Column>
      </Grid>
    </div>
  );
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

export default compose(
  graphql(registerMutation),

  withFormik({
    mapPropsToValues: () => ({ username: '', email: '', password: '', password2: '' }),
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
      const { username, email, password, password2 } = values;

      const response = await props.mutate({
        variables: { username, email, password, password2 }
      });

      const { sucess, errors } = response.data.register;

      if (sucess) {
        props.history.push('/login');
      } else {
        setErrors(errors);
      }
      setSubmitting(false);
    }
  })
)(Register);
