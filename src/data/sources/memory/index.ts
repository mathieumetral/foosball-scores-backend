import {PlayerData} from '@features/player/data/player';
import {TeamData} from '@features/team/data/team';

const Players = new Map<PlayerData['id'], PlayerData>();
const Teams = new Map<TeamData['id'], TeamData>();

export function getDataSourceMemory() {
  return {
    Players,
    Teams,
  };
}
