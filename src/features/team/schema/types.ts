import {schemaBuilder} from '@app/schema/builder';
import {Team} from '@features/team/data/team';
import {Player} from '@features/player/data/player';
import {Game} from '@features/game/data/game';
import {resolveWindowedConnection} from '@lib/pagination/utils';

schemaBuilder.node(Team, {
  name: 'Team',
  id: {
    resolve: team => team.getId(),
  },
  loadMany: ids => ids.map(id => Team.get(id)),
  fields: t => ({
    players: t.field({
      type: [Player],
      resolve: team => team.getPlayers(),
    }),
    games: t.connection({
      type: Game,
      resolve: (team, args) =>
        resolveWindowedConnection({args}, ({offset, limit}) => {
          return {
            items: team.getGames(offset, limit),
            totalCount: team.countGames(),
          };
        }),
    }),
  }),
});
