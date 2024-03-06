import styled from 'styled-components';
import { Team } from '@src/types/types';
import { getFlagImageUrl } from '@src/classes/team/FlagUrlParser';

export const Flag = styled.span<{ team: Team }>`
  ${(props) => {
    const flagImageUrl = getFlagImageUrl(props.team);
    return (
      flagImageUrl !== '/no/match/image.svg' &&
      `
      background-image: url(${flagImageUrl});
      background-repeat: no-repeat;
      background-position: center center; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
    `
    );
  }}
`;
