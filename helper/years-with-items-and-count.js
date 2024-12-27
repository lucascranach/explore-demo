/* Array of years with number of items
---------------------------------------------------------------------------- */
module.exports = getYearsWithItemsAndCount = (items) => {
  const years = items.map((item) => {
    const yearString = item.searchSortingNumber.split('-')[0];
    const regex = /\d+/;
    const match = yearString.match(regex);
    const year = match ? parseInt(match[0], 10) : null;
    return year;
  });
  const uniqueYears = [...new Set(years)];
  const yearCount = uniqueYears.map((year) => {
    const count = years.filter((y) => y === year).length;
    return { year, count };
  });
  return yearCount.sort((a, b) => a.year - b.year);
}
