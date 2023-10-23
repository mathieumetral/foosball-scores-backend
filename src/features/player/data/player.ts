import {Team} from '@features/team/data/team';
import {PlayerStats} from '@features/player/data/player-stats';
import {getDataSourcePostgreSQL} from '@data/sources/postgresql';

export interface PlayerData {
  id: string;
  name: string;
}

export class Player {
  constructor(private readonly data: PlayerData) {}

  static async get(id: PlayerData['id']): Promise<Player | null> {
    const data = await getDataSourcePostgreSQL().player.findUnique({where: {id}});
    return data ? new Player(data) : null;
  }

  static async getOrCreateByName(name: PlayerData['name']): Promise<Player> {
    const data = await getDataSourcePostgreSQL().player.upsert({
      where: {name},
      create: {name},
      update: {},
    });

    return new Player(data);
  }

  static async getMany(offset: number, limit: number): Promise<Player[]> {
    const data = await getDataSourcePostgreSQL().player.findMany({
      skip: offset,
      take: limit,
    });
    return data.map(entry => new Player(entry));
  }

  static async count(): Promise<number> {
    return getDataSourcePostgreSQL().player.count();
  }

  getId(): string {
    return this.data.id;
  }

  getName(): string {
    return this.data.name;
  }

  async getTeams(offset: number, limit: number): Promise<Team[]> {
    const teamRelations = await getDataSourcePostgreSQL().teamPlayer.findMany({
      where: {playerId: this.getId()},
      skip: offset,
      take: limit,
      select: {teamId: true},
    });

    const teams = await Promise.all(teamRelations.map(({teamId}) => Team.get(teamId)));
    return teams.filter(Boolean);
  }

  async countTeams(): Promise<number> {
    return getDataSourcePostgreSQL().teamPlayer.count({
      where: {
        playerId: this.getId(),
      },
    });
  }

  async getStats(): Promise<PlayerStats> {
    return PlayerStats.get(this.getId());
  }
}
