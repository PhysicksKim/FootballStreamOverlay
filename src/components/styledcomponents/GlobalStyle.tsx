import { createGlobalStyle } from 'styled-components';

interface GlobalStyleProps {
  fontFamily: string;
}

const GlobalStyle = createGlobalStyle<GlobalStyleProps>`
  body,
  button,
  input,
  textarea {
    font-family: ${props => props.fontFamily}, sans-serif;
  }
`;

export default GlobalStyle;