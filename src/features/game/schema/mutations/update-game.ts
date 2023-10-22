import {schemaBuilder} from '@app/schema/builder';
import {Game} from '@features/game/data/game';
import {decodeGlobalID} from '@pothos/plugin-relay';

export interface UpdateGameSideInput {
  playerName?: string | null | undefined;
  score?: number | null | undefined;
}

export interface UpdateGameInput {
  id: string | number;
  leftSide?: UpdateGameSideInput | null | undefined;
  rightSide?: UpdateGameSideInput | null | undefined;
}

// Inputs
const UpdateGameSideInputRef = schemaBuilder.inputRef<UpdateGameSideInput>('UpdateGameSideInput').implement({
  fields: t => ({
    playerName: t.string(),
    score: t.int(),
  }),
});

const UpdateGameInputRef = schemaBuilder.inputRef<UpdateGameInput>('UpdateGameInput').implement({
  fields: t => ({
    id: t.id({
      required: true,
    }),
    leftSide: t.field({
      type: UpdateGameSideInputRef,
    }),
    rightSide: t.field({
      type: UpdateGameSideInputRef,
    }),
  }),
});

// Mutation
schemaBuilder.mutationField('updateGame', t =>
  t.field({
    type: Game,
    nullable: true,
    args: {
      input: t.arg({type: UpdateGameInputRef, required: true}),
    },
    resolve: (parent, {input}) => {
      const {id} = decodeGlobalID(String(input.id));
      return Game.update({
        ...input,
        id,
      });
    },
  })
);
