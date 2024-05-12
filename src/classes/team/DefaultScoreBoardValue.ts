import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import EtcTeamCodes from './EtcTeamCodes';

export const defaultMatchNameTemplate = {
  EPL: '2023-24 잉글랜드 프리미어리그 34R',
  FA: '2023-24 잉글랜드 FA컵 결승전',
  UCL: '2023-24 UEFA 챔피언스리그 결승전',
};

export const defaultMatchName = defaultMatchNameTemplate.EPL;

export const defaultTeamA: Team = {
  category: 'epl2324',
  code: EPL2324Codes.맨시티.code,
  name: EPL2324Codes.맨시티.name,
  score: 0,
  uniform: 'home',
};

export const defaultTeamB: Team = {
  category: 'epl2324',
  code: EPL2324Codes.토트넘.code,
  name: EPL2324Codes.토트넘.name,
  score: 0,
  uniform: 'home',
};
