import {schemaBuilder} from '@app/schema/builder';
import {Player} from '@features/player/data/player';
import {resolveWindowedConnection} from '@lib/pagination/utils';

schemaBuilder.queryField('players', t =>
  t.connection({
    type: Player,
    resolve: (root, args) =>
      resolveWindowedConnection({args}, async ({offset, limit}) => ({
        items: await Player.getMany(offset, limit),
        totalCount: await Player.count(),
      })),
  })
);
