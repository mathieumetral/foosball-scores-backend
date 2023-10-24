import {schemaBuilder} from '@app/schema/builder';
import {Game} from '@features/game/data/game';

schemaBuilder.queryField('game', t =>
  t.field({
    type: Game,
    description: 'Fetches a single game based on its unique identifier.',
    nullable: true,
    args: {
      id: t.arg.globalID({
        description: 'The unique identifier of the game to be fetched.',
        required: true,
      }),
    },
    resolve: async (parent, {id: globalID}) => Game.get(globalID.id),
  })
);
