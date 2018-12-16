import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';

export class MessageBox extends Component {
  newMessage = React.createRef();
  scroller = React.createRef();

  state = {
    hasMoreItems: true
  };

  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.channelId);
  }

  componentWillReceiveProps({ data: { messages }, channelId }) {
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.setState({ hasMoreItems: true });
      }
      this.unsubscribe = this.subscribe(channelId);
    }

    if (
      this.scroller.current &&
      this.props.data.messages &&
      this.scroller.current.scrollTop < 20 &&
      messages &&
      this.props.data.messages !== messages.length
    ) {
      console.log('here');
      const heighBeforeRender = this.scroller.current.scrollHeight;

      setTimeout(() => {
        if (this.scroller.current) {
          this.scroller.current.scrollTop = this.scroller.current.scrollHeight - heighBeforeRender;
        }
      }, 5);
    }
    if (this.newMessage.current) this.newMessage.current.scrollIntoView();
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = channelId =>
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          messages: [subscriptionData.data.newChannelMessage, ...prev.messages]
        };
      }
    });

  handleScorll = () => {
    const {
      data: { messages, fetchMore },
      channelId
    } = this.props;

    if (
      this.scroller.current &&
      this.scroller.current.scrollTop === 0 &&
      this.state.hasMoreItems &&
      messages.length >= 15
    ) {
      console.log('fetchMore');

      fetchMore({
        variables: {
          channelId,
          cursor: messages[messages.length - 1].created_at
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          if (fetchMoreResult.messages.length < 15) {
            this.setState({ hasMoreItems: false });
          }

          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages]
          };
        }
      });
    }
  };

  render() {
    const {
      data: { loading, messages }
    } = this.props;

    return loading ? null : (
      <div
        style={{
          gridColumn: 3,
          gridRow: 2,
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column-reverse',
          overflowY: 'auto'
        }}
        onScroll={this.handleScorll}
        ref={this.scroller}
      >
        <div ref={this.newMessage} />
        <Comment.Group>
          {messages
            .slice()
            .reverse()
            .map(m => (
              <Comment key={`${m.id}-message`}>
                <Comment.Content>
                  <Comment.Author as="a">{m.user.username}</Comment.Author>
                  <Comment.Metadata>
                    <div>{new Date(parseInt(m.created_at)).toString()}</div>
                  </Comment.Metadata>
                  <Comment.Text>{m.text}</Comment.Text>
                  <Comment.Actions>{/* <Comment.Action>Reply</Comment.Action> */}</Comment.Actions>
                </Comment.Content>
              </Comment>
            ))}
        </Comment.Group>
      </div>
    );
  }
}

const messagesQuery = gql`
  query($cursor: String, $channelId: Int!) {
    messages(cursor: $cursor, channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      created_at
    }
  }
`;

export default graphql(messagesQuery, {
  options: props => ({
    fetchPolicy: 'network-only',
    variables: {
      channelId: props.channelId
    }
  })
})(MessageBox);
