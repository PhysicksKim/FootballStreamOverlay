import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import Euro2024Codes from './Euro2024Codes';
import EtcTeamCodes from './EtcTeamCodes';

export const defaultMatchNameTemplate = {
  EPL: '2023-24 잉글랜드 프리미어리그 38R',
  FA: '2023-24 잉글랜드 FA컵 결승전',
  EURO: 'UEFA 유로 2024 챔피언스 A조',
};

export const defaultMatchName = defaultMatchNameTemplate.EURO;

export const defaultTeamA: Team = {
  category: 'euro2024',
  code: Euro2024Codes.독일.code,
  name: Euro2024Codes.독일.name,
  score: 0,
  uniform: 'home',
};

export const defaultTeamB: Team = {
  category: 'euro2024',
  code: Euro2024Codes.스코틀랜드.code,
  name: Euro2024Codes.스코틀랜드.name,
  score: 0,
  uniform: 'home',
};
