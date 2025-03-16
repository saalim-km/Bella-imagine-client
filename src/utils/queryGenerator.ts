export const buildQueryParams = (filters: string[]): Record<string, any> => {
  const queryObject: Record<string, any> = {};

  const filterMap: Record<string, string> = {
    isActive: "isActive",
    notActive: "isActive",
    blocked: "isblocked",
    notBlocked: "isblocked",
    latest: "createdAt",
    older: "createdAt",
  };

  const valueMap: Record<string, boolean | number> = {
    isActive: true,
    notActive: false,
    blocked: true,
    notBlocked: false,
    latest: -1,
    older: 1,
  };

  filters.forEach((filter) => {
    const key = filterMap[filter];
    const value = valueMap[filter];

    if (key && value !== undefined) {
      queryObject[key] = value;
    }
  });

  return queryObject;
};
