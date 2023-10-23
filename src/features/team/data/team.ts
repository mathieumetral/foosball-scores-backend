import {Player, PlayerData} from '@features/player/data/player';
import {Game} from '@features/game/data/game';
import {getDataSourcePostgreSQL} from '@data/sources/postgresql';

export interface TeamData {
  id: string;
}

export class Team {
  constructor(private readonly data: TeamData) {}

  static async get(id: TeamData['id']): Promise<Team | null> {
    const data = await getDataSourcePostgreSQL().team.findUnique({where: {id}});
    return data ? new Team(data) : null;
  }

  static async getOrCreateByPlayerName(name: PlayerData['name']): Promise<Team> {
    const dataSource = getDataSourcePostgreSQL();
    const player = await Player.getOrCreateByName(name);

    const existingData = await dataSource.team.findFirst({
      where: {players: {every: {playerId: player.getId()}}},
    });
    if (existingData) {
      return new Team(existingData);
    }

    const createdData = await dataSource.team.create({
      data: {players: {create: {playerId: player.getId()}}},
    });
    return new Team(createdData);
  }

  getId(): string {
    return this.data.id;
  }

  async getPlayers(): Promise<Player[]> {
    const playerRelations = await getDataSourcePostgreSQL().teamPlayer.findMany({
      where: {teamId: this.getId()},
      select: {playerId: true},
    });

    const players = await Promise.all(playerRelations.map(({playerId}) => Player.get(playerId)));
    return players.filter(Boolean);
  }

  async getGames(offset: number, limit: number): Promise<Game[]> {
    const gameRelations = await getDataSourcePostgreSQL().game.findMany({
      where: {
        OR: [{leftTeamId: this.getId()}, {rightTeamId: this.getId()}],
      },
      skip: offset,
      take: limit,
      select: {id: true},
    });

    const games = await Promise.all(gameRelations.map(({id}) => Game.get(id)));
    return games.filter(Boolean);
  }

  async countGames(): Promise<number> {
    return getDataSourcePostgreSQL().game.count({
      where: {
        OR: [{leftTeamId: this.getId()}, {rightTeamId: this.getId()}],
      },
    });
  }
}
