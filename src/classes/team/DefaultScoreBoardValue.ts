import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';

export const defaultMatchName = '2023-24 잉글랜드 프리미어리그 25R';

export const defaultTeamA: Team = {
  category: 'epl2324',
  code: EPL2324Codes.맨시티.code,
  name: EPL2324Codes.맨시티.name,
  score: 0,
  uniform: 'home',
};

export const defaultTeamB: Team = {
  category: 'epl2324',
  code: EPL2324Codes.첼시.code,
  name: EPL2324Codes.첼시.name,
  score: 0,
  uniform: 'home',
};
