import {getDataSourceMemory} from '@data/sources/memory';
import {Team} from '@features/team/data/team';

export interface PlayerData {
  id: string;
  name: string;
}

export class Player {
  constructor(private readonly data: PlayerData) {}

  static get(id: string): Player | null {
    const data = getDataSourceMemory().Players.get(id);
    return data ? new Player(data) : null;
  }

  getId(): string {
    return this.data.id;
  }

  getName(): string {
    return this.data.name;
  }

  getTeams(offset: number, limit: number): Team[] {
    const teams = [...getDataSourceMemory().Teams.values()].filter(team => team.playerIds.includes(this.getId()));
    return teams
      .slice(offset, offset + limit)
      .map(({id}) => Team.get(id))
      .filter(Boolean);
  }

  countTeams(): number {
    return [...getDataSourceMemory().Teams.values()].filter(team => team.playerIds.includes(this.getId())).length;
  }
}
