import {PlayerData} from '@features/player/data/player';

const Players = new Map<PlayerData['id'], PlayerData>();

export function getDataSourceMemory() {
  return {
    Players,
  };
}
