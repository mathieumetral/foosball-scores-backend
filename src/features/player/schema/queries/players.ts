import {schemaBuilder} from '@app/schema/builder';
import {Player, PlayerOrderBy} from '@features/player/data/player';
import {resolveWindowedConnection} from '@lib/pagination/utils';

schemaBuilder.queryField('players', t =>
  t.connection({
    type: Player,
    args: {
      orderBy: t.arg({
        type: PlayerOrderBy,
      }),
    },
    resolve: (root, args) =>
      resolveWindowedConnection({args}, async ({offset, limit}) => ({
        items: await Player.getMany(offset, limit, args.orderBy),
        totalCount: await Player.count(),
      })),
  })
);
