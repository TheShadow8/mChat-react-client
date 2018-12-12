import React from 'react';

import SideBox from './SideBox/SideBox';

import Header from './ChatBox/Header';
import Messages from './ChatBox/Messages';
import SendMessage from './ChatBox/SendMessage';
import ChatRoomLayout from './ChatRoomLayout';

const ChatRoom = ({ match: { params } }) => (
  <ChatRoomLayout>
    <SideBox currentTeamId={params.teamId} />
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

export default ChatRoom;
