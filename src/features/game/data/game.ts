import {getDataSourceMemory} from '@data/sources/memory';
import {GameSide, GameSideData} from '@features/game/data/game-side';
import {CreateGameInput} from '@features/game/schema/mutations/create-game';
import {Team} from '@features/team/data/team';

export interface GameData {
  id: string;
  leftSideTeamId: GameSideData['teamId'];
  leftSideScore: GameSideData['score'];
  rightSideTeamId: GameSideData['teamId'];
  rightSideScore: GameSideData['score'];
}

export class Game {
  constructor(private readonly data: GameData) {}

  static get(id: string): Game | null {
    const data = getDataSourceMemory().Games.get(id);
    return data ? new Game(data) : null;
  }

  static create(input: CreateGameInput): Game {
    const leftSideTeam = Team.getOrCreateByPlayerName(input.leftSide.playerName);
    const rightSideTeam = Team.getOrCreateByPlayerName(input.rightSide.playerName);

    const newData: GameData = {
      id: crypto.randomUUID(),
      leftSideTeamId: leftSideTeam.getId(),
      rightSideTeamId: rightSideTeam.getId(),
      leftSideScore: input.leftSide.score ?? 0,
      rightSideScore: input.rightSide.score ?? 0,
    };
    getDataSourceMemory().Games.set(newData.id, newData);
    return new Game(newData);
  }

  getId(): string {
    return this.data.id;
  }

  getLeftSide(): GameSide {
    return new GameSide({
      teamId: this.data.leftSideTeamId,
      score: this.data.leftSideScore,
    });
  }

  getRightSide(): GameSide {
    return new GameSide({
      teamId: this.data.rightSideTeamId,
      score: this.data.rightSideScore,
    });
  }
}
