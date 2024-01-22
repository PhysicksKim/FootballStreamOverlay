import styled from 'styled-components';
import { Team } from '../TimerRoot';
import { getFlagImageUrl } from '@src/classes/FlagUrlParser';

export const Flag = styled.span<{ team: Team }>`
  background-image: url(${(props) => getFlagImageUrl(props.team)});
  background-repeat: no-repeat;
  background-size: cover;
`;
