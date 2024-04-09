import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import EtcTeamCodes from './EtcTeamCodes';

// '2023-24 잉글랜드 프리미어리그 30R';
// '2023-24 잉글랜드 FA컵 4강'
export const defaultMatchName = '2023-24 UEFA 챔피언스리그 8강 1차전';

export const defaultTeamA: Team = {
  category: 'epl2324',
  code: EPL2324Codes.맨시티.code,
  name: EPL2324Codes.맨시티.name,
  score: 0,
  uniform: 'third',
};

export const defaultTeamB: Team = {
  category: 'etc',
  code: EtcTeamCodes.레알마드리드.code,
  name: EtcTeamCodes.레알마드리드.name,
  score: 0,
  uniform: 'home',
};
