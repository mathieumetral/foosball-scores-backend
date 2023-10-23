import {schemaBuilder} from '@app/schema/builder';
import {resolveWindowedConnection} from '@lib/pagination/utils';
import {Game} from '@features/game/data/game';

schemaBuilder.queryField('games', t =>
  t.connection({
    type: Game,
    resolve: (root, args) =>
      resolveWindowedConnection({args}, async ({offset, limit}) => ({
        items: await Game.getMany(offset, limit),
        totalCount: await Game.count(),
      })),
  })
);
