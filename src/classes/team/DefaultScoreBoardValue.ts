import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';

// '2023-24 잉글랜드 프리미어리그 30R';
// '2023-24 잉글랜드 FA컵 4강'
export const defaultMatchName = '2023-24 잉글랜드 프리미어리그 32R';

export const defaultTeamA: Team = {
  category: 'epl2324',
  code: EPL2324Codes.맨유.code,
  name: EPL2324Codes.맨유.name,
  score: 0,
  uniform: 'home',
};

export const defaultTeamB: Team = {
  category: 'epl2324',
  code: EPL2324Codes.리버풀.code,
  name: EPL2324Codes.리버풀.name,
  score: 0,
  uniform: 'away',
};
