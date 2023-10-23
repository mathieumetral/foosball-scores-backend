import {schemaBuilder} from '@app/schema/builder';
import {Game} from '@features/game/data/game';

schemaBuilder.queryField('game', t =>
  t.field({
    type: Game,
    nullable: true,
    args: {
      id: t.arg.globalID({
        required: true,
      }),
    },
    resolve: async (parent, {id: globalID}) => Game.get(globalID.id),
  })
);
