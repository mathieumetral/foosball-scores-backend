import {schemaBuilder} from '@app/schema/builder';
import {Player} from '@features/player/data/player';

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
  }),
});
