import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

export class CreateTeam extends Component {
  state = {
    name: '',
    nameError: ''
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    this.setState({
      nameError: ''
    });

    const { name } = this.state;
    let response = null;

    // If not login, redirect to /
    try {
      response = await this.props.mutate({
        variables: { name }
      });
    } catch (err) {
      this.props.history.push('/');
      return;
    }

    const { sucess, errors } = response.data.createTeam;

    if (sucess) {
      this.props.history.push('/chatroom');
      console.log('Ok');
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
    const { name, nameError } = this.state;

    const errorList = [];

    if (nameError) {
      errorList.push(nameError);
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
                  value={name}
                  onChange={this.onChange}
                  error={!!nameError}
                />

                <Button color="teal" fluid size="large" onClick={this.onSubmit}>
                  Create
                </Button>
              </Segment>
            </Form>

            {nameError ? (
              <Message error header="There was some errors with your submission" list={errorList} />
            ) : null}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      sucess
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(CreateTeam);
