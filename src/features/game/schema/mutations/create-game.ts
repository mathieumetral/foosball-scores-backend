import {schemaBuilder} from '@app/schema/builder';
import {Game} from '@features/game/data/game';

export interface CreateGameSideInput {
  playerName: string;
  score?: number | null | undefined;
}

export interface CreateGameInput {
  datePlayed?: Date | null | undefined;
  leftSide: CreateGameSideInput;
  rightSide: CreateGameSideInput;
}

// Inputs
const CreateGameSideInputRef = schemaBuilder.inputRef<CreateGameSideInput>('CreateGameSideInput').implement({
  fields: t => ({
    playerName: t.string({
      required: true,
    }),
    score: t.int(),
  }),
});

const CreateGameInputRef = schemaBuilder.inputRef<CreateGameInput>('CreateGameInput').implement({
  fields: t => ({
    datePlayed: t.field({
      type: 'DateTime',
    }),
    leftSide: t.field({
      type: CreateGameSideInputRef,
      required: true,
    }),
    rightSide: t.field({
      type: CreateGameSideInputRef,
      required: true,
    }),
  }),
});

// Mutation
schemaBuilder.mutationField('createGame', t =>
  t.field({
    type: Game,
    args: {
      input: t.arg({type: CreateGameInputRef, required: true}),
    },
    resolve: (parent, {input}) => Game.create(input),
  })
);
