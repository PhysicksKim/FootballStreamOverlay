import styled from 'styled-components';
import { Team } from '@src/types/types';
import { getFlagImageUrl } from '@src/classes/team/FlagUrlParser';

/**
 * TeamFlag 컴포넌트는 팀의 국기 이미지를 표시합니다.
 * $team 프로퍼티에 팀 정보를 전달하면 해당 팀의 국기 이미지를 표시합니다.
 *
 * @comment $team 에서 $ 는 "해당 프로퍼티는 스타일에 사용된 후 html 에는 남기지 않는다" 라는 의미입니다.
 */
export const Flag = styled.span<{ $team: Team }>`
  ${(props) => {
    const flagImageUrl = getFlagImageUrl(props.$team);
    return (
      flagImageUrl !== '/no/match/image.svg' &&
      `
      background-image: url(${flagImageUrl});
      background-repeat: no-repeat;
      background-size: cover;
    `
    );
  }}
`;
