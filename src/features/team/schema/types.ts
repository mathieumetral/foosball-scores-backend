import {schemaBuilder} from '@app/schema/builder';
import {Team} from '@features/team/data/team';
import {Player} from '@features/player/data/player';

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
  }),
});
