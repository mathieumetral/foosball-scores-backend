import {schemaBuilder} from '@app/schema/builder';
import {Player, PlayerOrderBy} from '@features/player/data/player';
import {Team} from '@features/team/data/team';
import {resolveWindowedConnection} from '@lib/pagination/utils';
import {PlayerStats} from '@features/player/data/player-stats';

schemaBuilder.enumType(PlayerOrderBy, {
  name: 'PlayerOrderBy',
});

schemaBuilder.objectType(PlayerStats, {
  name: 'PlayerStats',
  description: 'Statistics related to a player, including wins, losses, goals, and more.',
  fields: t => ({
    wins: t.int({
      description: 'Total number of wins by the player.',
      resolve: playerStats => playerStats.getWins(),
    }),
    losses: t.int({
      description: 'Total number of losses by the player.',
      resolve: playerStats => playerStats.getLosses(),
    }),
    ratio: t.float({
      description: 'Win-loss ratio for the player.',
      resolve: playerStats => playerStats.getRatio(),
    }),
    goalsFor: t.int({
      description: 'Total number of goals scored by the player.',
      resolve: playerStats => playerStats.getGoalsFor(),
    }),
    goalsAgainst: t.int({
      description: 'Total number of goals scored against the player.',
      resolve: playerStats => playerStats.getGoalsAgainst(),
    }),
    goalsDifference: t.float({
      description: 'The difference between goals scored by the player and goals scored against them.',
      resolve: playerStats => playerStats.getGoalsDifference(),
    }),
  }),
});

schemaBuilder.node(Player, {
  name: 'Player',
  description: 'A representation of a player in the game with associated stats and teams they are a part of.',
  id: {
    description: 'The unique identifier for the player.',
    resolve: player => player.getId(),
  },
  loadMany: ids => ids.map(id => Player.get(id)),
  fields: t => ({
    name: t.string({
      description: 'The name of the player.',
      resolve: player => player.getName(),
    }),
    teams: t.connection({
      type: Team,
      description: 'A paginated list of teams that the player is associated with.',
      resolve: (player, args) =>
        resolveWindowedConnection({args}, async ({offset, limit}) => {
          return {
            items: await player.getTeams(offset, limit),
            totalCount: await player.countTeams(),
          };
        }),
    }),
    stats: t.field({
      type: PlayerStats,
      description: 'Statistics associated with the player.',
      resolve: player => player.getStats(),
    }),
  }),
});
