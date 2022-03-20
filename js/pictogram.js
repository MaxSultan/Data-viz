const readyPictogram = (male, female) => {
  let gender = [...document.getElementsByName("gender")].find(
    (input) => input.checked
  ).value;

  let genderData = gender === "Male" ? male : female;

  const sportSelect = document.getElementById("sport-selector");
  const levelSelect = document.getElementById("level-selector");
  let selectedSport = sportSelect.value;
  let selectedLevel = levelSelect.value;
  let displayedData = genderData.filter((d) => d.Sport === selectedSport)[0];
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

  const updatePictogramData = () => {
    displayedData = genderData.filter((d) => d.Sport === selectedSport)[0];
    displayedOdds = displayedData[`${selectedLevel}_Odds`];
    displayedPercent = displayedData[`Perc_${selectedLevel}`];
    displayedNum = parseInt(displayedOdds.split(":")[0], 10);
    d3.select("#pictogram").select("svg").remove();
    svg2.text(
      `${displayedPercent}% or 1 in ${displayedNum.toString()} high school participants play in ${selectedLevel}`
    );
    updatePictogram(displayedNum);
  };

  levelSelect.onchange = (event) => {
    selectedLevel = event.target.value;
    updatePictogramData();
  };
  sportSelect.onchange = (event) => {
    selectedSport = event.target.value;
    updatePictogramData();
  };
  const radioClick2 = () => {
    gender = [...document.getElementsByName("gender")].find(
      (input) => input.checked
    ).value;
    genderData = gender === "Male" ? male : female;

    const selectedGenderOptions = genderData.map((d) => d.Sport);
    sportSelect.innerHTML = "";
    for (var i = 0; i < selectedGenderOptions.length; i++) {
      var opt = selectedGenderOptions[i];

      var el = document.createElement("option");
      el.text = opt;
      el.value = opt;

      sportSelect.add(el);
    }
    // update the options to correct gender options
    selectedSport = sportSelect.value;
    updatePictogramData();
  };
  document
    .querySelectorAll("fieldset.gender-selector label input")
    .forEach((element) => element.addEventListener("click", radioClick2));
};

// data from: https://scholarshipstats.com/varsityodds
