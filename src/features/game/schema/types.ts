import {schemaBuilder} from '@app/schema/builder';
import {Team} from '@features/team/data/team';
import {Game} from '@features/game/data/game';
import {GameSide} from '@features/game/data/game-side';

schemaBuilder.objectType(GameSide, {
  name: 'GameSide',
  description: 'Represents one side of a game, detailing the team and its score.',
  fields: t => ({
    team: t.field({
      type: Team,
      description: 'The team participating on this side of the game.',
      resolve: gameSide => gameSide.getTeam(),
    }),
    score: t.int({
      description: 'The score achieved by the team on this side.',
      resolve: gameSide => gameSide.getScore(),
    }),
  }),
});

schemaBuilder.node(Game, {
  name: 'Game',
  description: 'Represents a match between two teams, detailing the date and scores for both sides.',
  id: {
    description: 'The unique identifier for the game.',
    resolve: game => game.getId(),
  },
  loadMany: ids => ids.map(id => Game.get(id)),
  fields: t => ({
    datePlayed: t.field({
      type: 'DateTime',
      description: 'The date and time when the game was played.',
      resolve: game => game.getDatePlayed(),
    }),
    leftSide: t.field({
      type: GameSide,
      description: 'Represents the left side of the game, detailing the team and its score.',
      resolve: game => game.getLeftSide(),
    }),
    rightSide: t.field({
      type: GameSide,
      description: 'Represents the right side of the game, detailing the team and its score.',
      resolve: game => game.getRightSide(),
    }),
  }),
});
