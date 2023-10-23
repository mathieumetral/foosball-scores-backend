import {schemaBuilder} from '@app/schema/builder';
import {Game} from '@features/game/data/game';
import {decodeGlobalID} from '@pothos/plugin-relay';

interface DeleteGameInput {
  id: string | number;
}

// Inputs
const DeleteGameInputRef = schemaBuilder.inputRef<DeleteGameInput>('DeleteGameInput').implement({
  fields: t => ({
    id: t.id({
      required: true,
    }),
  }),
});

// Mutation
schemaBuilder.mutationField('deleteGame', t =>
  t.field({
    type: Game,
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
