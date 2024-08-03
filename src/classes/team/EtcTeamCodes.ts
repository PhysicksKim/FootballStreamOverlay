import { TeamCodesAndNames } from '@src/types/types';

/**
 * 컵, 기타 팀 대응을 위한 카테고리 입니다.
 */
const EtcTeamCodes: TeamCodesAndNames = {
  기타컵팀대비용: { code: 'cup', name: '기타 컵팀 대비용' },
  // 빈팀: { code: 'ety', name: '비어있는팀로고' },
  빈팀: { code: 'ety', name: '바이에른뮌헨' },
  레알마드리드: { code: 'rmd', name: '레알마드리드' },
  도르트문트: { code: 'bvb', name: '도르트문트' },
  // 뮌헨: { code: 'muh', name: '바이에른뮌헨' },
};

export default EtcTeamCodes;
