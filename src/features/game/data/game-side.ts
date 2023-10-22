import {Team} from '@features/team/data/team';

export interface GameSideData {
  teamId: string;
  score: number;
}

export class GameSide {
  constructor(private readonly data: GameSideData) {}

  getScore(): number {
    return this.data.score;
  }

  getTeam(): Team {
    const team = Team.get(this.data.teamId);
    if (!team) {
      throw new Error(
        `Critical Error: Team (id: ${this.data.teamId}) not found for the game side. This indicates data integrity issues with games-to-teams relations.`
      );
    }

    return team;
  }
}
