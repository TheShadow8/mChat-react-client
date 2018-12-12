import React from 'react';

import Channels from './SideBox/Channels';
import Teams from './SideBox/Teams';
import Header from './ChatBox/Header';
import Messages from './ChatBox/Messages';
import SendMessage from './ChatBox/SendMessage';
import ChatRoomLayout from './ChatRoomLayout';

export default () => (
  <ChatRoomLayout>
    <Teams teams={[{ id: 1, letter: 'M' }, { id: 2, letter: 'D' }]} />
    <Channels
      teamName="Team name"
      username="Username"
      channels={[{ id: 1, name: 'general' }, { id: 2, name: 'random' }]}
      users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
    />
    <Header channelName="general" />
    <Messages>
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName="general" />
  </ChatRoomLayout>
);
