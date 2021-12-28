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
    width = 700 - margin.left - margin.right,
    height = 50 - margin.bottom - margin.top;

  const sportSelect = document.getElementById("sport-selector");
  const levelSelect = document.getElementById("level-selector");
  let selectedSport = sportSelect.value;
  let selectedLevel = levelSelect.value;
  let displayedData = data.filter((d) => d.Sport === selectedSport)[0];
  let displayedPercent = displayedData[`Perc_${selectedLevel}`];
  let displayedOdds = displayedData[`${selectedLevel}_Odds`];
  let displayedNum = parseInt(displayedOdds.split(":")[0], 10);

  // adds a pictogram for the first selected odds
  // TODO: make this dynamic

  function updatePictogram(updateNum) {
    const svg4 = d3
      .select("#pictogram")
      .append("svg")
      .attr("width", 500)
      .attr("height", 1000)
      .append("g")
      .attr("transform", `translate(80,0)`);

    const personHeight = 50;
    const personWidth = 60;
    const heightOffset = 10;
    const widthOffset = 30;

    function calculateRowNum(itemNum) {
      itemNum -= 1;
      if (itemNum.toString().split("").length === 1) return 0;
      else if (itemNum.toString().split("").length === 2) {
        return parseInt(itemNum.toString().split("").slice(0, 1).join(""));
      } else {
        return parseInt(itemNum.toString().split("").slice(0, 2).join(""));
      }
    }

    function calculateColumnNum(itemNum) {
      itemNum -= 1;
      const itemArray = itemNum.toString().split("");
      return itemArray[itemArray.length - 1] * (personWidth - widthOffset);
    }

    for (let i = 1; i <= updateNum; i++) {
      if (i === updateNum) {
        svg4
          .append("svg:image")
          .attr("xlink:href", "../assets/person_red.svg")
          .attr("width", personWidth)
          .attr("height", personHeight)
          .attr("x", calculateColumnNum(i))
          .attr("y", calculateRowNum(i) * (personHeight - heightOffset));
      } else {
        svg4
          .append("svg:image")
          .attr("xlink:href", "../assets/person-silhouette-svgrepo-com.svg")
          .attr("width", personWidth)
          .attr("height", personHeight)
          .attr("x", calculateColumnNum(i))
          .attr("y", calculateRowNum(i) * (personHeight - heightOffset))
          .attr("data-updateNum", i);
      }
    }
  }

  updatePictogram(displayedNum);

  const svg2 = d3
    .select("#pictogram-text")
    .append("text")
    .style("font-size", "20px")
    .text(
      `${displayedPercent}% or 1 in ${displayedNum.toString()} high school participants play in ${selectedLevel}`
    );

  const updateItem = () => {
    svg2.text(
      `${displayedPercent}% or 1 in ${displayedNum.toString()} high school participants play in ${selectedLevel}`
    );
    updatePictogram(displayedNum);
  };

  function removeSVG(selector) {
    d3.select(selector).select("svg").remove();
  }

  levelSelect.onchange = (event) => {
    selectedLevel = event.target.value;
    displayedData = data.filter((d) => d.Sport === selectedSport)[0];
    displayedOdds = displayedData[`${selectedLevel}_Odds`];
    displayedPercent = displayedData[`Perc_${selectedLevel}`];
    displayedNum = parseInt(displayedOdds.split(":")[0], 10);
    removeSVG("#pictogram");
    updateItem();
  };
  sportSelect.onchange = (event) => {
    selectedSport = event.target.value;
    displayedData = data.filter((d) => d.Sport === selectedSport)[0];
    displayedOdds = displayedData[`${selectedLevel}_Odds`];
    displayedPercent = displayedData[`Perc_${selectedLevel}`];
    displayedNum = parseInt(displayedOdds.split(":")[0], 10);
    removeSVG("#pictogram");
    updateItem();
  };
};

d3.csv("data/NCAA_Men.csv", percentType).then((res) => percentReady(res));

// data from: https://scholarshipstats.com/varsityodds
