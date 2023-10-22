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

  static getOrCreateByName(name: string): Player {
    const existingData = [...getDataSourceMemory().Players.values()].filter(data => data.name === name);
    if (existingData.length) {
      return new Player(existingData[0]);
    }

    const newData: PlayerData = {
      id: crypto.randomUUID(),
      name,
    };
    getDataSourceMemory().Players.set(newData.id, newData);
    return new Player(newData);
  }

  static getMany(offset: number, limit: number): Player[] {
    return [...getDataSourceMemory().Players.values()].slice(offset, offset + limit).map(data => new Player(data));
  }

  static count(): number {
    return [...getDataSourceMemory().Players.values()].length;
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
