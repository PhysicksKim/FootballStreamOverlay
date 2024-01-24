import { createGlobalStyle } from 'styled-components';

interface GlobalStyleProps {
  fontFamily: string;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  body,
  button,
  input,
  textarea,
  select,
  option {
    font-family: ${(props) => props.fontFamily}, sans-serif;
  }
`;

export default GlobalStyle;
