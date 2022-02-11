const percentType = (d) => {
  return {
    Sport: d.Sport,
    HS_US_Boys: +d.HS_US_Boys,
    College_US_Men: +d.College_US_Men,
    NCAA1_Men: +d.NCAA1_Men,
    Perc_College: +d.Perc_College,
    Perc_NCAA1: +d.Perc_NCAA1,
    College_Odds: d.College_Odds,
    NCAA1_Odds: d.NCAA1_Odds,
  };
};

const percentReady = (data) => {
  const sportSelect = document.getElementById("sport-selector");
  const levelSelect = document.getElementById("level-selector");
  let selectedSport = sportSelect.value;
  let selectedLevel = levelSelect.value;
  let displayedData = data.filter((d) => d.Sport === selectedSport)[0];
  let displayedPercent = displayedData[`Perc_${selectedLevel}`];
  let displayedOdds = displayedData[`${selectedLevel}_Odds`];
  let displayedNum = parseInt(displayedOdds.split(":")[0], 10);

  // adds a pictogram for the first selected odds

  function updatePictogram(updateNum) {
    const svg4 = d3
      .select("#pictogram")
      .append("svg")
      .attr("viewBox", `0 0 720 800`)
      // .attr("width", 500)
      // .attr("height", 720)
      .append("g")
      .attr("transform", `translate(180,0)`);

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
          .attr("xlink:href", "./assets/person_blue.svg")
          .attr("width", personWidth)
          .attr("height", personHeight)
          .attr("x", calculateColumnNum(i))
          .attr("y", calculateRowNum(i) * (personHeight - heightOffset));
      } else {
        svg4
          .append("svg:image")
          .attr("xlink:href", "./assets/person-silhouette-svgrepo-com.svg")
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
