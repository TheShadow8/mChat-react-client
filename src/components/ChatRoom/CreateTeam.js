import React from 'react';
import { withFormik } from 'formik';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

function CreateTeam({ handleChange, handleSubmit, values, isSubmitting, errors }) {
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
            Create a new team
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                name="name"
                fluid
                iconPosition="left"
                icon="group"
                placeholder="Team name"
                value={values.name}
                onChange={handleChange}
                error={errorCheck.name}
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                color="teal"
                fluid
                size="large"
                onClick={handleSubmit}
              >
                Create
              </Button>
            </Segment>
          </Form>
          {errorList.length > 0 ? (
            <Message error header="There was some errors with your submission" list={errorList} />
          ) : null}
        </Grid.Column>
      </Grid>
    </div>
  );
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      sucess
      errors {
        path
        message
      }
      team {
        id
      }
    }
  }
`;

export default compose(
  graphql(createTeamMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
      const { name } = values;
      let response = null;

      // If not login, redirect to /
      try {
        response = await props.mutate({
          variables: { name }
        });
      } catch (err) {
        setErrors([{ path: 'server', message: 'Something wrong with a server' }]);
        setSubmitting(false);
        return;
      }

      const { sucess, errors, team } = response.data.createTeam;

      if (sucess) {
        props.history.push(`/chat-room/${team.id}`);
      } else {
        setErrors(errors);
      }
      setSubmitting(false);
    }
  })
)(CreateTeam);
