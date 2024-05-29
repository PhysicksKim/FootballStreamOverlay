import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import EtcTeamCodes from './EtcTeamCodes';

export const defaultMatchNameTemplate = {
  EPL: '2023-24 잉글랜드 프리미어리그 38R',
  FA: '2023-24 잉글랜드 FA컵 결승전',
  UCL: '2023-24 UEFA 챔피언스리그 결승전',
};

export const defaultMatchName = defaultMatchNameTemplate.UCL;

export const defaultTeamA: Team = {
  category: 'etc',
  code: EtcTeamCodes.도르트문트.code,
  name: EtcTeamCodes.도르트문트.name,
  score: 0,
  uniform: 'home',
};

export const defaultTeamB: Team = {
  category: 'etc',
  code: EtcTeamCodes.레알마드리드.code,
  name: EtcTeamCodes.레알마드리드.name,
  score: 0,
  uniform: 'home',
};
