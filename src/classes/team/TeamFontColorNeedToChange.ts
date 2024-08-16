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
  'ars-away',
  'wlv-home',
  'lei-third',
  'liv-third',
  'sou-away',
];

const etcWhiteUniform = [
  'cup-away',
  'cup-third',
  'ety-away',
  'ety-third',
  'rmd-home',
  'bvb-home',
];

const euro2024WhiteUniform = [
  'ger-home',
  'ger-away',
  'ger-third',
  'sco-away',
  'sco-third',
  'hun-away',
  'hun-third',
  'sui-away',
  'sui-third',
  'esp-away',
  'esp-third',
  'cro-home',
  'ita-away',
  'ita-third',
  'alb-away',
  'alb-third',
  'svn-home',
  'den-away',
  'den-third',
  'srb-away',
  'srb-third',
  'eng-home',
  'pol-home',
  'aut-away',
  'aut-third',
  'fra-away',
  'fra-third',
  'bel-away',
  'bel-third',
  'svk-away',
  'svk-third',
  'rou-home',
  'ukr-home',
  'tur-home',
  'geo-home',
  'por-away',
  'por-third',
  'cze-away',
  'cze-third',
];

const isEpl2324WhiteUniform = (code: string, uniform: string) => {
  const codeUniform = `${code}-${uniform}`;
  return epl2324WhiteUniform.includes(codeUniform);
};

const isEtcWhiteUniform = (code: string, uniform: string) => {
  const codeUniform = `${code}-${uniform}`;
  return etcWhiteUniform.includes(codeUniform);
};

const isEuro2024WhiteUniform = (code: string, uniform: string) => {
  const codeUniform = `${code}-${uniform}`;
  return euro2024WhiteUniform.includes(codeUniform);
};

const isNeedToBlackFontColor = (team: Team) => {
  const { category, code, uniform } = team;
  if (category === 'epl2324') {
    return isEpl2324WhiteUniform(code, uniform);
  } else if (category === 'etc') {
    return isEtcWhiteUniform(code, uniform);
  } else if (category === 'euro2024') {
    return isEuro2024WhiteUniform(code, uniform);
  }
  return false;
};

export default isNeedToBlackFontColor;
