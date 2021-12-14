const percentType = (d) => {
  return {
    Sport: d.Sport,
    /* chart 1 - bar chart showing participation by numbers */
    HS_US_Boys: +d.HS_US_Boys,
    College_US_Men: +d.College_US_Men,
    NCAA1_Men: +d.NCAA1_Men,
    /* chart 2 - text showing % of HS athletes in college/NCAA1 */
    Perc_College: +d.Perc_College,
    Perc_NCAA1: +d.Perc_NCAA1,
    /* chart 3 - text showing odds of playing college/NCAA1 */
    College_Odds: d.College_Odds,
    NCAA1_Odds: d.NCAA1_Odds,
  };
};

const percentReady = (data) => {
  /* Sizing convention */
  const margin = { top: 65, left: 90, right: 25, bottom: 25 },
    width = 250 - margin.left - margin.right,
    height = 100 - margin.bottom - margin.top;

  const sportSelect = document.getElementById("sport-selector");
  const levelSelect = document.getElementById("level-selector");
  let selectedSport = sportSelect.value;
  let selectedLevel = levelSelect.value;
  let displayedData = data.filter((d) => d.Sport === selectedSport)[0];
  console.log(displayedData);
  let displayedPercent = displayedData[`Perc_${selectedLevel}`];
  let displayedOdds = displayedData[`${selectedLevel}_Odds`];

  console.log(displayedOdds);

  const svg2 = d3
    .select("#percent-viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .append("g")
    .attr("transform", `translate(${margin.left + 10}, ${margin.top})`)
    .append("text")
    .style("font-size", "40px")
    .text(`${displayedPercent}%`);

  const svg3 = d3
    .select("#odd-viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .append("text")
    .style("font-size", "40px")
    .text(displayedOdds);

  const updateItem = () => {
    svg2.text(`${displayedPercent}%`);
    svg3.text(displayedOdds);
  };

  levelSelect.onchange = (event) => {
    selectedLevel = event.target.value;
    displayedData = data.filter((d) => d.Sport === selectedSport)[0];
    displayedOdds = displayedData[`${selectedLevel}_Odds`];
    displayedPercent = displayedData[`Perc_${selectedLevel}`];
    updateItem();
  };
  sportSelect.onchange = (event) => {
    selectedSport = event.target.value;
    displayedData = data.filter((d) => d.Sport === selectedSport)[0];
    displayedOdds = displayedData[`${selectedLevel}_Odds`];
    displayedPercent = displayedData[`Perc_${selectedLevel}`];
    updateItem();
  };
};

d3.csv("data/NCAA_Men.csv", percentType).then((res) => percentReady(res));

// data from: https://scholarshipstats.com/varsityodds
