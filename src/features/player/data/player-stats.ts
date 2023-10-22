import {PlayerData} from '@features/player/data/player';
import {getDataSourceMemory} from '@data/sources/memory';

export interface PlayerStatsData {
  wins: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export class PlayerStats {
  constructor(private readonly data: PlayerStatsData) {}

  static get(playerId: PlayerData['id']) {
    const playerTeams = [...getDataSourceMemory().Teams.values()].filter(team => team.playerIds.includes(playerId));

    const playerTeamIds = playerTeams.map(team => team.id);

    const games = [...getDataSourceMemory().Games.values()].filter(
      game => playerTeamIds.includes(game.leftSideTeamId) || playerTeamIds.includes(game.rightSideTeamId)
    );

    const statsData: PlayerStatsData = {
      wins: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };

    games.forEach(game => {
      const isPlayerOnLeft = playerTeamIds.includes(game.leftSideTeamId);

      if (isPlayerOnLeft) {
        if (game.leftSideScore > game.rightSideScore) {
          statsData.wins += 1;
        } else if (game.leftSideScore < game.rightSideScore) {
          statsData.losses += 1;
        }
        statsData.goalsFor += game.leftSideScore;
        statsData.goalsAgainst += game.rightSideScore;
      } else {
        if (game.rightSideScore > game.leftSideScore) {
          statsData.wins += 1;
        } else if (game.rightSideScore < game.leftSideScore) {
          statsData.losses += 1;
        }
        statsData.goalsFor += game.rightSideScore;
        statsData.goalsAgainst += game.leftSideScore;
      }
    });

    return new PlayerStats(statsData);
  }

  getWins(): number {
    return this.data.wins;
  }

  getLosses(): number {
    return this.data.losses;
  }

  getGoalsFor(): number {
    return this.data.goalsFor;
  }

  getGoalsAgainst(): number {
    return this.data.goalsAgainst;
  }
}
