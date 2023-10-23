import {Team} from '@features/team/data/team';
import {PlayerStats} from '@features/player/data/player-stats';
import {getDataSourcePostgreSQL} from '@data/sources/postgresql';
import {Prisma} from '@prisma/client';

export interface PlayerData {
  id: string;
  name: string;
}

export enum PlayerOrderBy {
  WINS_MOST,
  WINS_LEAST,
  RATIO_GOAL_DIFF_MOST,
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

  static async getMany(offset: number, limit: number, orderBy?: PlayerOrderBy | null | undefined): Promise<Player[]> {
    let orderByClause: Prisma.Sql;

    switch (orderBy) {
      case PlayerOrderBy.WINS_LEAST:
        orderByClause = Prisma.sql`stats."numberOfWins" ASC`;
        break;
      case PlayerOrderBy.WINS_MOST:
        orderByClause = Prisma.sql`stats."numberOfWins" DESC`;
        break;
      case PlayerOrderBy.RATIO_GOAL_DIFF_MOST:
      default:
        orderByClause = Prisma.sql`stats."winRatio" DESC, stats."goalDifference" DESC`;
        break;
    }

    // WARNING: Directly casting the database result like this can be risky.
    const data: PlayerData[] = await getDataSourcePostgreSQL().$queryRaw`
        SELECT p.*, stats."numberOfWins"
        FROM "Player" p
        LEFT JOIN (
            SELECT tp."playerId",
                SUM(CASE
                    WHEN g."leftTeamId" = tp."teamId" AND g."leftTeamScore" > g."rightTeamScore" THEN 1
                    WHEN g."rightTeamId" = tp."teamId" AND g."rightTeamScore" > g."leftTeamScore" THEN 1
                    ELSE 0
                END) AS "numberOfWins",
                CASE
                    WHEN COUNT(g.id) = 0 THEN 0
                    ELSE (CAST(SUM(CASE
                        WHEN g."leftTeamId" = tp."teamId" AND g."leftTeamScore" > g."rightTeamScore" THEN 1
                        WHEN g."rightTeamId" = tp."teamId" AND g."rightTeamScore" > g."leftTeamScore" THEN 1
                        ELSE 0
                    END) AS FLOAT) / COUNT(g.id)) END AS "winRatio",
                SUM(CASE
                    WHEN g."leftTeamId" = tp."teamId" THEN g."leftTeamScore" - g."rightTeamScore"
                    WHEN g."rightTeamId" = tp."teamId" THEN g."rightTeamScore" - g."leftTeamScore"
                    ELSE 0
                END) AS "goalDifference"
            FROM "TeamPlayer" tp
            JOIN "Game" g ON g."leftTeamId" = tp."teamId" OR g."rightTeamId" = tp."teamId"
            GROUP BY tp."playerId"
        ) stats ON p."id" = stats."playerId"
        ORDER BY ${orderByClause}
        OFFSET ${offset}
        LIMIT ${limit};
    `;
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
