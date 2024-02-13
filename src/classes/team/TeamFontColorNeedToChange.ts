import { Team } from '@src/types/types';
const epl2324WhiteUniform = [
  'ava-away',
  'cry-away',
  'ful-home',
  'lut-away',
  'mci-away',
  'mun-third',
  'shu-third',
  'tot-home',
  'whu-away',
];

const isEpl2324WhiteUniform = (code: string, uniform: string) => {
  const codeUniform = `${code}-${uniform}`;
  return epl2324WhiteUniform.includes(codeUniform);
};

const isNeedToBlackFontColor = (team: Team) => {
  const { category, code, uniform } = team;
  if (category === 'epl2324') {
    return isEpl2324WhiteUniform(code, uniform);
  }
  return false;
};

export default isNeedToBlackFontColor;
