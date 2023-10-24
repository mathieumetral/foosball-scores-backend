import {schemaBuilder} from '@app/schema/builder';
import {Player, PlayerOrderBy} from '@features/player/data/player';
import {resolveWindowedConnection} from '@lib/pagination/utils';

schemaBuilder.queryField('players', t =>
  t.connection({
    type: Player,
    description:
      'Fetches a paginated list of players. Pagination parameters follow the GraphQL connections specification. Results can be sorted with a custom order using the "orderBy" argument.',
    args: {
      orderBy: t.arg({
        description: 'Determines the order in which players are returned.',
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
