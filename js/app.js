const men = d3.csv("data/NCAA_Men.csv", (data) => type(data, "Men"));
const women = d3.csv("data/NCAA_Women.csv", (data) => type(data, "Women"));

const type = (d, string) => ({
  Sport: d.Sport, // categorical
  HS_US: +d[`HS_US_${string}`], // quantitative
  College_US: +d[`College_US_${string}`], // quantitative
  NCAA1: +d[`NCAA1_${string}`], // quantitative
  Perc_College: +d[`Perc_College_${string}`], // quantitative
  Perc_NCAA1: +d[`Perc_NCAA1_${string}`], // quantitative
  College_Odds: d[`College_Odds_${string}`], // ordered? quantitative?
  NCAA1_Odds: d[`NCAA1_Odds_${string}`], // ordered? quantitative?
});

Promise.all([men, women]).then((res) => {
  readyBarChart(res[0], res[1]);
  readyPictogram(res[0], res[1]);
});
