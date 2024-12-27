/* Array of years with items
---------------------------------------------------------------------------- */
module.exports = getYearsWithItems = (items) => {
  const years = items.map((item) => {
    const yearString = item.searchSortingNumber.split('-')[0];
    const regex = /\d+/;
    const match = yearString.match(regex);
    const year = match ? parseInt(match[0], 10) : null;
    return year;
  });
  const uniqueYears = [...new Set(years)];
  return uniqueYears;
};