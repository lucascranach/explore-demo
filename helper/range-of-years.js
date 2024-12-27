/* From when to when do we have items?
---------------------------------------------------------------------------- */
module.exports = getRangeOfYears = (items) => {
  const years = items.map((item) => {
    const yearString = item.searchSortingNumber.split('-')[0];
    const regex = /\d+/;
    const match = yearString.match(regex);
    const year = match ? parseInt(match[0], 10) : null;
    return year;
  });
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  return [minYear, maxYear];
}