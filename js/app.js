const type = (d) => {
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

const ready = (data) => {
  let metric = "HS_US_Boys";

  function click() {
    switch (this.textContent) {
      case "High School":
        metric = "HS_US_Boys";
        break;
      case "College":
        metric = "College_US_Men";
        break;
      case "Division 1":
        metric = "NCAA1_Men";
        break;
    }
    const updatedBarChartData = data.sort((a, b) => {
      return d3.descending(a[metric], b[metric]);
    });
    update(updatedBarChartData);
  }

  d3.selectAll("button").on("click", click);

  const barChartData = data.sort((a, b) => {
    return d3.descending(a.HS_US_Boys, b.HS_US_Boys);
  });

  /* Sizing convention */
  const margin = { top: 60, left: 120, right: 90, bottom: 60 },
    width = 560 - margin.left - margin.right,
    height = 560 - margin.bottom - margin.top;

  /* X values */
  const xMax = d3.max(barChartData, (d) => d.HS_US_Boys);
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
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .style("border", "solid")
    // .style("border-width", "2px")
    // .style("border-radius", "5px")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  /* Add axes */
  const xAxisDraw = svg.append("g").attr("class", "x").call(xAxis);
  const yAxisDraw = svg.append("g").call(yAxis);

  update(barChartData);
  //   const dur = 1000;
  //   const t = d3.transition().duration(dur);

  /* Add data items */
  function update(data) {
    xScale.domain([0, d3.max(data, (d) => d[metric])]);
    yScale.domain(data.map((d) => d.Sport));
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
            .transition()
            .delay((d, i) => i * 20)
            .duration(1000)
            .attr("width", (d) => xScale(d.HS_US_Boys))
            .style("fill", "#00b5e2");
        },
        (update) =>
          update
            .transition()
            .duration(1000)
            .attr("y", (d) => yScale(d.Sport))
            .attr("width", (d) => xScale(d[metric])),
        (exit) => exit.remove()
      );

    xAxisDraw.transition().duration(1000).call(xAxis.scale(xScale));
    yAxisDraw.transition().duration(1000).call(yAxis.scale(yScale));
  }
};

d3.csv("data/NCAA_Men.csv", type).then((res) => ready(res));

// data from: https://scholarshipstats.com/varsityodds
