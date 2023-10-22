import {getDataSourceMemory} from '@data/sources/memory';
import {GameSide, GameSideData} from '@features/game/data/game-side';

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
