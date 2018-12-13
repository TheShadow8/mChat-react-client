import React from 'react';
import { graphql } from 'react-apollo';
import { allTeamsQuery } from '../Utils/graphql/team';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import SideBox from './SideBox/SideBox';
import Header from './ChatBox/Header';
import Messages from './ChatBox/Messages';
import SendMessage from './ChatBox/SendMessage';
import ChatRoomLayout from './ChatRoomLayout';

const ChatRoom = ({
  data: { loading, allTeams },
  match: {
    params: { teamId, channelId }
  }
}) => {
  if (loading) {
    return null;
  }

  if (!allTeams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInteger = parseInt(teamId, 10);
  const teamIdx = teamIdInteger ? findIndex(allTeams, ['id', teamIdInteger]) : 0;
  const team = teamIdx === -1 ? allTeams[0] : allTeams[teamIdx];

  const channelIdInteger = parseInt(channelId, 10);
  const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <ChatRoomLayout>
      <SideBox
        teams={allTeams.map(t => ({ id: t.id, letter: t.name.charAt(0).toUpperCase() }))}
        team={team}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && (
        <Messages channelId={channel.id}>
          <ul className="message-list">
            <li />
            <li />
          </ul>
        </Messages>
      )}
      {channel && <SendMessage channelName={channel.name} />}
    </ChatRoomLayout>
  );
};

export default graphql(allTeamsQuery)(ChatRoom);
