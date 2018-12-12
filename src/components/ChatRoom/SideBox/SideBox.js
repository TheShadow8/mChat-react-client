import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';
import Channels from './Channels';
import Teams from './Teams';

const SideBox = ({ data: { loading, allTeams }, currentTeamId }) => {
  if (loading) {
    return null;
  }

  const teamIndex = currentTeamId ? findIndex(allTeams, ['id', parseInt(currentTeamId, 10)]) : 0;
  const team = allTeams[teamIndex];

  let username = '';

  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    username = user.username;
  } catch (err) {}

  return (
    <React.Fragment>
      <Teams teams={allTeams.map(t => ({ id: t.id, letter: t.name.charAt(0).toUpperCase() }))} />
      <Channels
        teamName={team.name}
        username={username}
        channels={team.channels}
        users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }]}
      />
    </React.Fragment>
  );
};

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;
export default graphql(allTeamsQuery)(SideBox);
