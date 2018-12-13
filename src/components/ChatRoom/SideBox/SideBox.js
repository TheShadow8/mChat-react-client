import React, { Component } from 'react';
import decode from 'jwt-decode';

import './SideBox.css';
import Channels from './Channels';
import Teams from './Teams';
import AddChannelModal from './AddChannelModal';
import InviteMemberModal from './InviteMemberModal';

export class SideBox extends Component {
  state = {
    toggleAddChannelModal: false,
    toggleInviteMemberModal: false
  };

  toggleAddChannelModal = e => {
    e.preventDefault();
    this.setState({ toggleAddChannelModal: !this.state.toggleAddChannelModal });
  };

  toggleInviteMemberModal = e => {
    e.preventDefault();
    this.setState({ toggleInviteMemberModal: !this.state.toggleInviteMemberModal });
  };

  render() {
    const { team, teams } = this.props;
    const { toggleAddChannelModal, toggleInviteMemberModal } = this.state;

    let username = '';

    try {
      const token = localStorage.getItem('token');
      const { user } = decode(token);
      username = user.username;
    } catch (err) {}

    return (
      <React.Fragment>
        <Teams teams={teams} />
        <Channels
          teamName={team.name}
          username={username}
          teamId={team.id}
          channels={team.channels}
          users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
          onAddChannelClick={this.toggleAddChannelModal}
          onInvitePeopleClick={this.toggleInviteMemberModal}
        />
        <AddChannelModal
          teamId={team.id}
          onClose={this.toggleAddChannelModal}
          open={toggleAddChannelModal}
        />
        <InviteMemberModal
          teamId={team.id}
          onClose={this.toggleInviteMemberModal}
          open={toggleInviteMemberModal}
        />
      </React.Fragment>
    );
  }
}

export default SideBox;
