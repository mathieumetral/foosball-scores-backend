import {schemaBuilder} from '@app/schema/builder';
import {Team} from '@features/team/data/team';
import {Game} from '@features/game/data/game';
import {GameSide} from '@features/game/data/game-side';

schemaBuilder.objectType(GameSide, {
  name: 'GameSide',
  fields: t => ({
    team: t.field({
      type: Team,
      resolve: gameSide => gameSide.getTeam(),
    }),
    score: t.int({
      resolve: gameSide => gameSide.getScore(),
    }),
  }),
});

schemaBuilder.node(Game, {
  name: 'Game',
  id: {
    resolve: game => game.getId(),
  },
  loadMany: ids => ids.map(id => Game.get(id)),
  fields: t => ({
    datePlayed: t.field({
      type: 'DateTime',
      resolve: game => game.getDatePlayed(),
    }),
    leftSide: t.field({
      type: GameSide,
      resolve: game => game.getLeftSide(),
    }),
    rightSide: t.field({
      type: GameSide,
      resolve: game => game.getRightSide(),
    }),
  }),
});
