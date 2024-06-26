import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import Euro2024Codes from './Euro2024Codes';
import EtcTeamCodes from './EtcTeamCodes';

export const defaultMatchNameTemplate = {
  EPL: '2023-24 잉글랜드 프리미어리그 38R',
  EURO: 'UEFA 유로 2024 토너먼트 16강',
};

export const defaultMatchName = defaultMatchNameTemplate.EURO;

export const defaultTeamA: Team = {
  category: 'euro2024',
  code: Euro2024Codes.포르투갈.code,
  name: Euro2024Codes.포르투갈.name,
  score: 0,
  uniform: 'home',
};

export const defaultTeamB: Team = {
  category: 'euro2024',
  code: Euro2024Codes.슬로베니아.code,
  name: Euro2024Codes.슬로베니아.name,
  score: 0,
  uniform: 'home',
};
