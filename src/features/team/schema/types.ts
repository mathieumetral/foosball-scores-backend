import {schemaBuilder} from '@app/schema/builder';
import {Team} from '@features/team/data/team';
import {Player} from '@features/player/data/player';
import {Game} from '@features/game/data/game';
import {resolveWindowedConnection} from '@lib/pagination/utils';

schemaBuilder.node(Team, {
  name: 'Team',
  description: 'A group of players that has participated in various games.',
  id: {
    description: 'The unique identifier for the team.',
    resolve: team => team.getId(),
  },
  loadMany: ids => ids.map(id => Team.get(id)),
  fields: t => ({
    players: t.field({
      type: [Player],
      description: 'List of players in the team.',
      resolve: team => team.getPlayers(),
    }),
    games: t.connection({
      type: Game,
      description: 'Games the team has participated in.',
      resolve: (team, args) =>
        resolveWindowedConnection({args}, async ({offset, limit}) => {
          return {
            items: await team.getGames(offset, limit),
            totalCount: await team.countGames(),
          };
        }),
    }),
  }),
});
