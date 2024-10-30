import { Team } from '@src/types/types';
import EPL2324Codes from './EPLCodes';
import Euro2024Codes from './Euro2024Codes';
import EtcTeamCodes from './EtcTeamCodes';

export const defaultMatchNameTemplate = {
  EPL: '2024-25 잉글랜드 프리미어리그 10R',
  EURO: 'UEFA EURO 2024',
  ETC: '2024-25 FA 커뮤니티 실드',
};

export const defaultMatchName = defaultMatchNameTemplate.EPL;

export const defaultTeamA: Team = {
  category: 'epl2324',
  code: EPL2324Codes.맨유.code,
  name: EPL2324Codes.맨유.name,
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
