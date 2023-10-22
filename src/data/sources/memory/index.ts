import {PlayerData} from '@features/player/data/player';
import {TeamData} from '@features/team/data/team';
import {GameData} from '@features/game/data/game';

const Players = new Map<PlayerData['id'], PlayerData>();
const Teams = new Map<TeamData['id'], TeamData>();
const Games = new Map<GameData['id'], GameData>();

export function getDataSourceMemory() {
  return {
    Players,
    Teams,
    Games,
  };
}
