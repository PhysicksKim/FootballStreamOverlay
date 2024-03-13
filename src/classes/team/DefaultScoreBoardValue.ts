import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';

export const defaultMatchName = '2023-24 FA컵 8강';

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
