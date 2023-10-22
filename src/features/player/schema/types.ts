import {schemaBuilder} from '@app/schema/builder';
import {Player} from '@features/player/data/player';
import {Team} from '@features/team/data/team';
import {resolveWindowedConnection} from '@lib/pagination/utils';

schemaBuilder.node(Player, {
  name: 'Player',
  id: {
    resolve: player => player.getId(),
  },
  loadMany: ids => ids.map(id => Player.get(id)),
  fields: t => ({
    name: t.string({
      resolve: player => player.getName(),
    }),
    teams: t.connection({
      type: Team,
      resolve: (player, args) =>
        resolveWindowedConnection({args}, ({offset, limit}) => {
          return {
            items: player.getTeams(offset, limit),
            totalCount: player.countTeams(),
          };
        }),
    }),
  }),
});
