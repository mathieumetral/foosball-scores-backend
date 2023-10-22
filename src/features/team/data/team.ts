import {getDataSourceMemory} from '@data/sources/memory';
import {Player, PlayerData} from '@features/player/data/player';
import {Game} from '@features/game/data/game';

export interface TeamData {
  id: string;
  playerIds: string[];
}

export class Team {
  constructor(private readonly data: TeamData) {}

  static get(id: TeamData['id']): Team | null {
    const data = getDataSourceMemory().Teams.get(id);
    return data ? new Team(data) : null;
  }

  static getOrCreateByPlayerName(name: PlayerData['name']): Team {
    const player = Player.getOrCreateByName(name);

    const existingData = [...getDataSourceMemory().Teams.values()].filter(
      data => data.playerIds.length === 1 && data.playerIds.includes(player.getId())
    );
    if (existingData.length) {
      return new Team(existingData[0]);
    }

    const newData: TeamData = {
      id: crypto.randomUUID(),
      playerIds: [player.getId()],
    };
    getDataSourceMemory().Teams.set(newData.id, newData);
    return new Team(newData);
  }

  getId(): string {
    return this.data.id;
  }

  getPlayers(): Player[] {
    return this.data.playerIds.map(playerId => Player.get(playerId)).filter(Boolean);
  }

  getGames(offset: number, limit: number): Game[] {
    const games = [...getDataSourceMemory().Games.values()].filter(
      game => game.leftSideTeamId === this.getId() || game.rightSideTeamId === this.getId()
    );
    return games
      .slice(offset, offset + limit)
      .map(({id}) => Game.get(id))
      .filter(Boolean);
  }

  countGames(): number {
    return [...getDataSourceMemory().Games.values()].filter(
      game => game.leftSideTeamId === this.getId() || game.rightSideTeamId === this.getId()
    ).length;
  }
}
