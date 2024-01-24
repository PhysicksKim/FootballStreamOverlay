import AsiancupCodes from './AsiancupCodes';
import EPL2324Codes from './EPLCodes';

export const Categories = {
  EPL2324: 'epl2324',
  Asiancup: 'asiancup',
};

export const CategoryCodes = {
  EPL2324: EPL2324Codes,
  Asiancup: AsiancupCodes,
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
    case Categories.Asiancup:
      return '아시안컵';
    default:
      throw new Error('Invalid category');
  }
};

export const categoryStringToTeamCodes = (category: string) => {
  switch (category) {
    case Categories.EPL2324:
      return CategoryCodes.EPL2324;
    case Categories.Asiancup:
      return CategoryCodes.Asiancup;
    default:
      throw new Error('Invalid category');
  }
};
