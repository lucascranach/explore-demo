exports.getHeader = (eleventy, content) => {
  const currentDay= new Date().getDate();
  const currentMonth = new Date().getMonth() +1;
  const currentYear = new Date().getFullYear();
  const publishDate = `${currentYear}-${currentMonth}-${currentDay}`;

 const title = content.title ? ` - ${content.title}` : '';

  return `
    <head>
      <title>Explore CDA</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta property="og:title" content="${content.title}">
      <meta property="article:published_time" content="${publishDate}">
      <meta name="author" content="cda Team">

      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="view-transition" content="same-origin">

      <link href="/compiled-assets/styles.css" rel="stylesheet">
      <script defer src="https://cdn.jsdelivr.net/npm/d3@7"></script>
      <script defer type="module" src="/assets/scripts/main.js"></script>
      
    </head>
  `;
};
