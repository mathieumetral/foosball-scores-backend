import {GameSide, GameSideData} from '@features/game/data/game-side';
import {CreateGameInput} from '@features/game/schema/mutations/create-game';
import {Team} from '@features/team/data/team';
import {UpdateGameInput} from '@features/game/schema/mutations/update-game';
import {getDataSourcePostgreSQL} from '@data/sources/postgresql';

export interface GameData {
  id: string;
  datePlayed: Date;
  leftTeamId: GameSideData['teamId'];
  leftTeamScore: GameSideData['score'];
  rightTeamId: GameSideData['teamId'];
  rightTeamScore: GameSideData['score'];
}

export class Game {
  constructor(private data: GameData) {}

  static async get(id: GameData['id']): Promise<Game | null> {
    const data = await getDataSourcePostgreSQL().game.findUnique({where: {id}});
    return data ? new Game(data) : null;
  }

  static async getMany(offset: number, limit: number): Promise<Game[]> {
    const data = await getDataSourcePostgreSQL().game.findMany({
      orderBy: {
        datePlayed: 'desc',
      },
      skip: offset,
      take: limit,
    });
    return data.map(entry => new Game(entry));
  }

  static async count(): Promise<number> {
    return getDataSourcePostgreSQL().game.count();
  }

  static async create(input: CreateGameInput): Promise<Game> {
    const isDuplicatePlayer = input.leftSide.playerName === input.rightSide.playerName;
    if (isDuplicatePlayer) {
      throw new Error(`The same player is present in both teams.`);
    }

    const [leftTeam, rightTeam] = await Promise.all([
      Team.getOrCreateByPlayerName(input.leftSide.playerName),
      Team.getOrCreateByPlayerName(input.rightSide.playerName),
    ]);

    const createdData = await getDataSourcePostgreSQL().game.create({
      data: {
        datePlayed: input.datePlayed ?? undefined,
        leftTeamId: leftTeam.getId(),
        rightTeamId: rightTeam.getId(),
        leftTeamScore: input.leftSide.score ?? 0,
        rightTeamScore: input.rightSide.score ?? 0,
      },
    });
    return new Game(createdData);
  }

  async update(input: Omit<UpdateGameInput, 'id'>) {
    const leftTeamPromise = input.leftSide?.playerName
      ? Team.getOrCreateByPlayerName(input.leftSide.playerName)
      : Promise.resolve(this.getLeftSide().getTeam());

    const rightTeamPromise = input.rightSide?.playerName
      ? Team.getOrCreateByPlayerName(input.rightSide.playerName)
      : Promise.resolve(this.getRightSide().getTeam());

    const [leftTeam, rightTeam] = await Promise.all([leftTeamPromise, rightTeamPromise]);

    this.data = await getDataSourcePostgreSQL().game.update({
      where: {id: this.getId()},
      data: {
        datePlayed: input.datePlayed ?? this.getDatePlayed(),
        leftTeamId: leftTeam.getId(),
        rightTeamId: rightTeam.getId(),
        leftTeamScore: input.leftSide?.score ?? this.getLeftSide().getScore(),
        rightTeamScore: input.rightSide?.score ?? this.getRightSide().getScore(),
      },
    });
  }

  async delete() {
    await getDataSourcePostgreSQL().game.delete({
      where: {id: this.getId()},
    });
  }

  getId(): string {
    return this.data.id;
  }

  getDatePlayed(): Date {
    return this.data.datePlayed;
  }

  getLeftSide(): GameSide {
    return new GameSide({
      teamId: this.data.leftTeamId,
      score: this.data.leftTeamScore,
    });
  }

  getRightSide(): GameSide {
    return new GameSide({
      teamId: this.data.rightTeamId,
      score: this.data.rightTeamScore,
    });
  }
}
