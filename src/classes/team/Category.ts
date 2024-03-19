import NationCodes from './AsiancupCodes';
import EPL2324Codes from './EPLCodes';
import EtcTeamCodes from './EtcTeamCodes';

export const Categories = {
  EPL2324: 'epl2324',
  Nation: 'nation',
  EtcTeam: 'etc',
};

export const CategoryCodes = {
  EPL2324: EPL2324Codes,
  Nation: NationCodes,
  EtcTeam: EtcTeamCodes,
};

export const teamCodeToTeamName = (category: string, code: string) => {
  const teamCodesAndNames = categoryStringToTeamCodes(category);
  for (const [key, team] of Object.entries(teamCodesAndNames)) {
    if (team.code === code) {
      return team.name;
    }
  }
};

export const categoryStringToTitle = (category: string) => {
  switch (category) {
    case Categories.EPL2324:
      return 'EPL 23/24';
    case Categories.Nation:
      return '국가대표';
    case Categories.EtcTeam:
      return '기타';
    default:
      return '';
  }
};

export const categoryStringToTeamCodes = (category: string) => {
  switch (category) {
    case Categories.EPL2324:
      return CategoryCodes.EPL2324;
    case Categories.Nation:
      return CategoryCodes.Nation;
    case Categories.EtcTeam:
      return CategoryCodes.EtcTeam;
    default:
      return {};
  }
};

export const isValidCategoryAndTeamCode = (
  category: string,
  teamCode: string,
) => {
  if (!category || !teamCode) return false;

  const teamCodesAndNames = categoryStringToTeamCodes(category);

  const codes = Object.values(teamCodesAndNames).map((team) => team.code);

  return codes.includes(teamCode);
};
