const readyBarChart = (male, female) => {
  let metric = "HS_US";
  let gender = [...document.getElementsByName("gender")].find(
    (input) => input.checked
  ).value;

  let genderData = gender === "Male" ? male : female;

  /* event listener functions */

  const tip = d3.select("#tooltip");
  const tipHeader = d3.select("#tooltip-header");
  const tipBody = d3.select("#tooltip-body");

  const mouseenter = (event) => {
    const selectedData = d3.select(event.target).data()[0];
    tip
      .style("left", event.clientX + "px")
      .style("top", event.clientY + "px")
      .transition()
      .style("opacity", 0.98);
    tipHeader.html("Sport: " + selectedData.Sport);
    tipBody.html("Participants: " + selectedData[metric].toLocaleString());
    d3.select("#tooltip").style("opacity", 0.98);
  };

  const mousemove = (event) => {
    tip.style("left", event.clientX + "px").style("top", event.clientY + "px");
  };

  const mouseleave = (event) => {
    tip.transition().style("opacity", 0);
  };

  const radioClick = () => {
    gender = [...document.getElementsByName("gender")].find(
      (input) => input.checked
    ).value;
    genderData = gender === "Male" ? male : female;
    updateBarChart(genderData);
  };

  document
    .querySelectorAll("fieldset.gender-selector label input")
    .forEach((element) => element.addEventListener("click", radioClick));

  const click = (event) => {
    switch (event.target.textContent) {
      case "High School":
        metric = "HS_US";
        break;
      case "College":
        metric = "College_US";
        break;
      case "Division 1":
        metric = "NCAA1";
        break;
    }

    document
      .getElementsByClassName("selected-button")[0]
      .classList.remove("selected-button");
    event.target.classList.add("selected-button");

    updateBarChart(genderData);
  };

  const barChartData = genderData.sort((a, b) => {
    return d3.descending(a.HS_US, b.HS_US);
  });

  /* Sizing convention */
  const margin = { top: 60, left: 200, right: 90, bottom: 60 },
    width = 600 - margin.left - margin.right,
    height = 560 - margin.bottom - margin.top;

  /* X values */
  const xMax = d3.max(barChartData, (d) => d.HS_US);
  const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]);
  const xAxis = d3
    .axisTop(xScale)
    .ticks(5)
    .tickFormat(d3.format("~s"))
    .tickSize(-height)
    .tickSizeOuter(0);

  /* Y values */
  const yScale = d3
    .scaleBand()
    .domain(barChartData.map((d) => d.Sport))
    .rangeRound([0, height])
    .paddingInner(0.1);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select("#participation-viz")
    .append("svg")
    // viewBox makes the graph mobile responsive
    .attr(
      "viewBox",
      `0 0 ${height + margin.top + margin.bottom} ${
        width + margin.left + margin.right
      }`
    )
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Transitions
  const dur = 1000;
  //   const t = d3.transition().duration(dur);

  d3.select("#participation-buttons").selectAll("button").on("click", click);

  svg
    .selectAll(".bar")
    .data(genderData, (d) => d.Sport)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => yScale(d.Sport))
    .attr("height", (d) => yScale.bandwidth())
    .attr("data-sport", (d) => d.Sport)
    .attr("data-participation", (d) => d.HS_US)
    .on("mouseenter", mouseenter)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .transition()
    .delay((d, i) => i * 20)
    .duration(dur)
    .attr("width", (d) => xScale(d.HS_US))
    .style("fill", (d) => (d.Sport === "Tennis" ? "#0D76B7" : "#BBC5CF"));
  /* Add axes */
  const xAxisDraw = svg.append("g").attr("class", "x").call(xAxis);
  const yAxisDraw = svg.append("g").call(yAxis);

  /* Add data items and deal with updated items/axes/scales */
  const updateBarChart = (data) => {
    data = data.sort((a, b) => {
      return d3.descending(a[metric], b[metric]);
    });
    // update scale domains
    xScale.domain([0, d3.max(data, (d) => d[metric])]);
    yScale.domain(data.map((d) => d.Sport));

    // update data encoding with data join
    svg
      .selectAll(".bar")
      .data(data, (d) => d.Sport)
      .join(
        (enter) => {
          enter
            .append("rect")
            .attr("class", "bar")
            .attr("y", (d) => yScale(d.Sport))
            .attr("height", (d) => yScale.bandwidth())
            .attr("data-sport", (d) => d.Sport)
            .attr("data-participation", (d) => d[metric])
            .on("mouseenter", mouseenter)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .transition()
            .delay((d, i) => i * 20)
            .duration(dur)
            .attr("width", (d) => xScale(d[metric]))
            .style("fill", "#e6e6e6");
        },
        (update) =>
          update
            .transition()
            .duration(dur)
            .attr("y", (d) => yScale(d.Sport))
            .attr("width", (d) => xScale(d[metric]))
            .attr("data-participation", (d) => d[metric]),
        (exit) => exit.remove()
      );

    // update drawn axes
    xAxisDraw.transition().duration(dur).call(xAxis.scale(xScale));
    yAxisDraw.transition().duration(dur).call(yAxis.scale(yScale));
  };
};

// data from: https://scholarshipstats.com/varsityodds
