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
  const barChartData = data.sort((a, b) => {
    return d3.descending(a.HS_US_Boys, b.HS_US_Boys);
  });

  console.log(barChartData);
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
    .paddingInner(0.5);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select("#viz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  /* Add axes */
  svg.append("g").attr("class", "x").call(xAxis);
  svg.append("g").call(yAxis);

  /* Add data items */
  svg
    .selectAll(".bar")
    .data(barChartData)
    .join((enter) =>
      enter
        .append("rect")
        .attr("class", "bar")
        .attr("y", (d) => yScale(d.Sport))
        .attr("height", (d) => yScale.bandwidth())
        .attr("width", (d) => xScale(d.HS_US_Boys))
    );
};

d3.csv("data/NCAA_Men.csv", type).then((res) => ready(res));

// data from: https://scholarshipstats.com/varsityodds
