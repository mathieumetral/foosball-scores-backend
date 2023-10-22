import {getDataSourceMemory} from '@data/sources/memory';

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
}
