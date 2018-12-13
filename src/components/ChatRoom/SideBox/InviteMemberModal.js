import React from 'react';
import { Form, Button, Modal, Message } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const InviteMemberModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  touched,
  errors
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

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Add Member to your Team</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Form.Input
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              fluid
              error={errorCheck.email}
              placeholder="User's email"
            />
          </Form.Field>
          {/* {touched.email && errors.email ? errors.email[0] : null} */}
          <Form.Group widths="equal">
            <Button disabled={isSubmitting} fluid onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isSubmitting} onClick={handleSubmit} type="submit" fluid>
              Add User
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

const addTeamMemberMutation = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      sucess
      errors {
        path
        message
      }
    }
  }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values,
      { props: { onClose, teamId, mutate }, setSubmitting, setErrors }
    ) => {
      const response = await mutate({
        variables: { teamId, email: values.email }
      });
      const { sucess, errors } = response.data.addTeamMember;
      if (sucess) {
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        setErrors(errors);
      }
    }
  })
)(InviteMemberModal);
