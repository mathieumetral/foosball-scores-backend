import {schemaBuilder} from '@app/schema/builder';
import {Game} from '@features/game/data/game';
import {decodeGlobalID} from '@pothos/plugin-relay';

export interface UpdateGameSideInput {
  playerName?: string | null | undefined;
  score?: number | null | undefined;
}

export interface UpdateGameInput {
  id: string | number;
  datePlayed?: Date | null | undefined;
  leftSide?: UpdateGameSideInput | null | undefined;
  rightSide?: UpdateGameSideInput | null | undefined;
}

// Inputs
const UpdateGameSideInputRef = schemaBuilder.inputRef<UpdateGameSideInput>('UpdateGameSideInput').implement({
  description: 'Input type for updating a game side. Only provided fields will be updated.',
  fields: t => ({
    playerName: t.string({
      description: 'Name for the player on this side of the game.',
    }),
    score: t.int({
      description: 'Score for the game side.',
    }),
  }),
});

const UpdateGameInputRef = schemaBuilder.inputRef<UpdateGameInput>('UpdateGameInput').implement({
  description: 'Input type for updating a game. Only provided fields will be updated.',
  fields: t => ({
    id: t.id({
      description: 'The unique identifier of the game to be updated.',
      required: true,
    }),
    datePlayed: t.field({
      type: 'DateTime',
      description: 'Date and time when the game was played.',
    }),
    leftSide: t.field({
      type: UpdateGameSideInputRef,
      description: 'Information for updating the left side of the game.',
    }),
    rightSide: t.field({
      type: UpdateGameSideInputRef,
      description: 'Information for updating the right side of the game.',
    }),
  }),
});

// Mutation
schemaBuilder.mutationField('updateGame', t =>
  t.field({
    type: Game,
    description:
      'Updates a game based on the provided input. Only provided fields will be updated. Returns the updated game if successful, and null if the game is not found.',
    nullable: true,
    args: {
      input: t.arg({type: UpdateGameInputRef, required: true}),
    },
    resolve: async (parent, {input}) => {
      const {id} = decodeGlobalID(String(input.id));
      const game = await Game.get(String(id));
      if (!game) {
        return null;
      }

      await game.update(input);
      return game;
    },
  })
);
