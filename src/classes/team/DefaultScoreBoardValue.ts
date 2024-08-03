import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import Euro2024Codes from './Euro2024Codes';
import EtcTeamCodes from './EtcTeamCodes';

export const defaultMatchNameTemplate = {
  EPL: '2023-24 잉글랜드 프리미어리그 38R',
  // EURO: 'UEFA 유로 2024 결승전',
  EURO: '쿠팡플레이 시리즈 친선',
};

export const defaultMatchName = defaultMatchNameTemplate.EURO;

export const defaultTeamA: Team = {
  category: 'epl2324',
  code: EPL2324Codes.토트넘.code,
  name: EPL2324Codes.토트넘.name,
  score: 0,
  uniform: 'home',
};

export const defaultTeamB: Team = {
  category: 'etc',
  code: EtcTeamCodes.빈팀.code,
  name: EtcTeamCodes.빈팀.name,
  score: 0,
  uniform: 'home',
};
