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
  description: 'Input type that defines the structure for creating a game side, specifying the player and their score.',
  fields: t => ({
    playerName: t.string({
      description: 'The name of the player participating in this game side.',
      required: true,
    }),
    score: t.int({
      description: 'The score achieved by the player in this game side. If not provided, it defaults to 0.',
    }),
  }),
});

const CreateGameInputRef = schemaBuilder.inputRef<CreateGameInput>('CreateGameInput').implement({
  description:
    'Input type that outlines the structure for creating a new game, specifying both sides and the date played.',
  fields: t => ({
    datePlayed: t.field({
      type: 'DateTime',
      description: 'The date and time when the game was played. If not specified, it defaults to the current time.',
    }),
    leftSide: t.field({
      type: CreateGameSideInputRef,
      description: 'The left side of the game, specifying the player and their score.',
      required: true,
    }),
    rightSide: t.field({
      type: CreateGameSideInputRef,
      description: 'The right side of the game, specifying the player and their score.',
      required: true,
    }),
  }),
});

// Mutation
schemaBuilder.mutationField('createGame', t =>
  t.field({
    type: Game,
    description: 'Mutation to create a new game with specified sides and date played.',
    args: {
      input: t.arg({type: CreateGameInputRef, required: true}),
    },
    resolve: (parent, {input}) => Game.create(input),
  })
);
