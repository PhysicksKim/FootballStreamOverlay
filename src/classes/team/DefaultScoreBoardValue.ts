import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import Euro2024Codes from './Euro2024Codes';
import EtcTeamCodes from './EtcTeamCodes';

export const defaultMatchNameTemplate = {
  EPL: '2024-25 잉글랜드 프리미어리그 25R',
  EURO: 'UEFA EURO 2024',
  ETC: '24-25 UEFA 챔피언스리그 녹아웃 PO 1차전',
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
  code: EPL2324Codes.뉴캐슬.code,
  name: EPL2324Codes.뉴캐슬.name,
  score: 0,
  uniform: 'home',
};
