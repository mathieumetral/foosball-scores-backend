import {schemaBuilder} from '@app/schema/builder';
import {Game} from '@features/game/data/game';
import {decodeGlobalID} from '@pothos/plugin-relay';

interface DeleteGameInput {
  id: string | number;
}

// Inputs
const DeleteGameInputRef = schemaBuilder.inputRef<DeleteGameInput>('DeleteGameInput').implement({
  description: 'Input type for deleting a game based on its unique identifier.',
  fields: t => ({
    id: t.id({
      description: 'The unique identifier of the game to be deleted.',
      required: true,
    }),
  }),
});

// Mutation
schemaBuilder.mutationField('deleteGame', t =>
  t.field({
    type: Game,
    description:
      'Deletes a game based on the provided ID and returns the deleted game if successful. If no game is found for the given ID, null is returned.',
    nullable: true,
    args: {
      input: t.arg({type: DeleteGameInputRef, required: true}),
    },
    resolve: async (parent, {input}) => {
      const {id} = decodeGlobalID(String(input.id));
      const game = await Game.get(String(id));
      if (!game) {
        return null;
      }

      await game.delete();
      return game;
    },
  })
);
