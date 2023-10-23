import {PlayerData} from '@features/player/data/player';
import {getDataSourcePostgreSQL} from '@data/sources/postgresql';

export interface PlayerStatsData {
  wins: number;
  losses: number;
  ratio: number;
  goalsFor: number;
  goalsAgainst: number;
}

export class PlayerStats {
  constructor(private readonly data: PlayerStatsData) {}

  static async get(playerId: PlayerData['id']): Promise<PlayerStats> {
    const dataSource = getDataSourcePostgreSQL();

    const playerTeamRelations = await dataSource.teamPlayer.findMany({
      where: {playerId: playerId},
      select: {teamId: true},
    });
    const playerTeamIds = playerTeamRelations.map(({teamId}) => teamId);

    // Use a raw SQL query to calculate statistics

    // WARNING: Directly casting the database result like this can be risky and is not recommended for production.
    // Instead, consider using a validation library like 'zod' to ensure the result structure and type safety.
    // The current method is used for simplicity in this example and might lead to runtime errors.
    const stats: {[0]: PlayerStatsData} = await getDataSourcePostgreSQL().$queryRaw`
        SELECT
            SUM(CASE
                WHEN "leftTeamId" = ANY(${playerTeamIds}) AND "leftTeamScore" > "rightTeamScore" THEN 1
                WHEN "rightTeamId" = ANY(${playerTeamIds}) AND "rightTeamScore" > "leftTeamScore" THEN 1
                ELSE 0
            END) AS "wins",
            SUM(CASE
                WHEN "leftTeamId" = ANY(${playerTeamIds}) AND "leftTeamScore" < "rightTeamScore" THEN 1
                WHEN "rightTeamId" = ANY(${playerTeamIds}) AND "rightTeamScore" < "leftTeamScore" THEN 1
                ELSE 0
            END) AS "losses",
            COALESCE(
                CAST(SUM(CASE
                  WHEN "leftTeamId" = ANY(${playerTeamIds}) AND "leftTeamScore" > "rightTeamScore" THEN 1
                  WHEN "rightTeamId" = ANY(${playerTeamIds}) AND "rightTeamScore" > "leftTeamScore" THEN 1
                  ELSE 0
                END) AS FLOAT)
                /
                NULLIF(SUM(CASE
                  WHEN "leftTeamId" = ANY(${playerTeamIds}) AND "leftTeamScore" < "rightTeamScore" THEN 1
                  WHEN "rightTeamId" = ANY(${playerTeamIds}) AND "rightTeamScore" < "leftTeamScore" THEN 1
                  ELSE 0
                END) + SUM(CASE
                  WHEN "leftTeamId" = ANY(${playerTeamIds}) AND "leftTeamScore" > "rightTeamScore" THEN 1
                  WHEN "rightTeamId" = ANY(${playerTeamIds}) AND "rightTeamScore" > "leftTeamScore" THEN 1
                  ELSE 0
            END), 0), 0) AS "ratio",
            SUM(CASE
                WHEN "leftTeamId" = ANY(${playerTeamIds}) THEN "leftTeamScore"
                ELSE 0
            END)
            +
            SUM(CASE
                WHEN "rightTeamId" = ANY(${playerTeamIds}) THEN "rightTeamScore"
                ELSE 0
            END) AS "goalsFor",
            SUM(CASE
                WHEN "leftTeamId" = ANY(${playerTeamIds}) THEN "rightTeamScore"
                ELSE 0
            END)
            +
            SUM(CASE
                WHEN "rightTeamId" = ANY(${playerTeamIds}) THEN "leftTeamScore"
                ELSE 0
            END) AS "goalsAgainst"
        FROM "Game"
        WHERE "leftTeamId" = ANY(${playerTeamIds}) OR "rightTeamId" = ANY(${playerTeamIds});
    `;

    const statsData: PlayerStatsData = {
      wins: Number(stats[0].wins) || 0,
      losses: Number(stats[0].losses) || 0,
      ratio: Number(stats[0].ratio) || 0,
      goalsFor: Number(stats[0].goalsFor) || 0,
      goalsAgainst: Number(stats[0].goalsAgainst) || 0,
    };

    return new PlayerStats(statsData);
  }

  getWins(): number {
    return this.data.wins;
  }

  getLosses(): number {
    return this.data.losses;
  }

  getRatio(): number {
    return Number(this.data.ratio.toFixed(2));
  }

  getGoalsFor(): number {
    return this.data.goalsFor;
  }

  getGoalsAgainst(): number {
    return this.data.goalsAgainst;
  }

  getGoalsDifference(): number {
    return this.data.goalsFor - this.data.goalsAgainst;
  }
}
