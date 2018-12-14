import React from 'react';
import { Form, Button, Modal, Message } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import { allTeamsQuery } from '../../Utils/graphql/team';

const AddChannelModal = ({
  open,
  onClose,
  values,
  errors,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm
}) => {
  const errorCheck = {};
  const errorList = [];

  // Check and push error tho errorList if have errors
  if (errors.length > 0) {
    for (const error of errors) {
      errorList.push(error.message);
      errorCheck[error.path] = true;
    }
  }
  const onCloseHandle = e => {
    onClose(e);
    resetForm();
  };

  return (
    <Modal className="modal" open={open} onClose={onCloseHandle}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Form.Input
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              fluid
              error={errorCheck.name}
              placeholder="Channel name"
            />
          </Form.Field>
          <Form.Group widths="equal">
            <Button disabled={isSubmitting} fluid onClick={onCloseHandle}>
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit" onClick={handleSubmit} fluid>
              Create Channel
            </Button>
          </Form.Group>
        </Form>
        {errorList.length > 0 ? (
          <Message error header="There was some errors with your submission" list={errorList} />
        ) : null}
      </Modal.Content>
    </Modal>
  );
};

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      sucess
      channel {
        id
        name
      }
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting, setErrors, resetForm }
    ) => {
      await mutate({
        variables: { teamId, name: values.name },

        update: (store, { data: { createChannel } }) => {
          const { sucess, channel, errors } = createChannel;

          if (sucess) {
            const data = store.readQuery({ query: allTeamsQuery });
            const teamIdx = findIndex(data.allTeams, ['id', teamId]);

            data.allTeams[teamIdx].channels.push(channel);
            store.writeQuery({ query: allTeamsQuery, data });

            onClose();
            setSubmitting(false);
            resetForm();
          } else {
            setSubmitting(false);
            setErrors(errors);
          }
        }
      });
      setSubmitting(false);
    }
  })
)(AddChannelModal);
