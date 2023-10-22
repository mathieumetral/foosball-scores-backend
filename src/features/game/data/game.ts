import {getDataSourceMemory} from '@data/sources/memory';
import {GameSide, GameSideData} from '@features/game/data/game-side';
import {CreateGameInput} from '@features/game/schema/mutations/create-game';
import {Team} from '@features/team/data/team';
import {UpdateGameInput} from '@features/game/schema/mutations/update-game';

export interface GameData {
  id: string;
  leftSideTeamId: GameSideData['teamId'];
  leftSideScore: GameSideData['score'];
  rightSideTeamId: GameSideData['teamId'];
  rightSideScore: GameSideData['score'];
}

export class Game {
  constructor(private data: GameData) {}

  static get(id: string): Game | null {
    const data = getDataSourceMemory().Games.get(id);
    return data ? new Game(data) : null;
  }

  static getMany(offset: number, limit: number): Game[] {
    return [...getDataSourceMemory().Games.values()].slice(offset, offset + limit).map(data => new Game(data));
  }

  static count(): number {
    return [...getDataSourceMemory().Games.values()].length;
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

  update(input: Omit<UpdateGameInput, 'id'>) {
    const leftSideBeforeUpdate = this.getLeftSide();
    const rightSideBeforeUpdate = this.getRightSide();

    this.data.leftSideTeamId = input.leftSide?.playerName
      ? Team.getOrCreateByPlayerName(input.leftSide.playerName).getId()
      : leftSideBeforeUpdate.getTeam().getId();
    this.data.rightSideTeamId = input.rightSide?.playerName
      ? Team.getOrCreateByPlayerName(input.rightSide.playerName).getId()
      : rightSideBeforeUpdate.getTeam().getId();

    this.data.leftSideScore = input.leftSide?.score ?? leftSideBeforeUpdate.getScore();
    this.data.rightSideScore = input.rightSide?.score ?? rightSideBeforeUpdate.getScore();

    getDataSourceMemory().Games.set(this.getId(), this.data);
  }

  delete() {
    getDataSourceMemory().Games.delete(this.getId());
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
