import {getDataSourceMemory} from '@data/sources/memory';
import {Player} from '@features/player/data/player';

export interface TeamData {
  id: string;
  playerIds: string[];
}

export class Team {
  constructor(private readonly data: TeamData) {}

  static get(id: string): Team | null {
    const data = getDataSourceMemory().Teams.get(id);
    return data ? new Team(data) : null;
  }

  getId(): string {
    return this.data.id;
  }

  getPlayers(): Player[] {
    return this.data.playerIds.map(playerId => Player.get(playerId)).filter(Boolean);
  }
}
