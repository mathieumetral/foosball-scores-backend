import {schemaBuilder} from '@app/schema/builder';
import {Player} from '@features/player/data/player';
import {Team} from '@features/team/data/team';
import {resolveWindowedConnection} from '@lib/pagination/utils';
import {PlayerStats} from '@features/player/data/player-stats';

schemaBuilder.objectType(PlayerStats, {
  name: 'PlayerStats',
  fields: t => ({
    wins: t.int({
      resolve: playerStats => playerStats.getWins(),
    }),
    losses: t.int({
      resolve: playerStats => playerStats.getLosses(),
    }),
    goalsFor: t.int({
      resolve: playerStats => playerStats.getGoalsFor(),
    }),
    goalsAgainst: t.int({
      resolve: playerStats => playerStats.getGoalsAgainst(),
    }),
  }),
});

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
    stats: t.field({
      type: PlayerStats,
      resolve: player => player.getStats(),
    }),
  }),
});
