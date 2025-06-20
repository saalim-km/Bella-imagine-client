export const buildQueryParams = (filters: string[]): Record<string, any> => {
  const queryObject: Record<string, any> = {};

  const filterMap: Record<string, string> = {
    isActive: "isActive",
    notActive: "isActive",
    blocked: "isblocked",
    notBlocked: "isblocked",
    latest: "createdAt",
    oldest: "createdAt",
    wedding: "category",
    couple: "category",
    potrait: "category",
  };

  const valueMap: Record<string, boolean | number | string> = {
    isActive: true,
    notActive: false,
    blocked: true,
    notBlocked: false,
    latest: -1,
    oldest: 1,
    wedding: "Wedding",
    couple: "Couple",
    potrait: "Portrait",
  };

  filters.forEach((filter) => {
    const key = filterMap[filter];
    const value = valueMap[filter];

    if (key && value !== undefined) {
      if (filter === "latest" || filter === "oldest") {
        queryObject[key] = value;
      } else {
        queryObject[key] = value;
      }
    }
  });

  return queryObject;
};
