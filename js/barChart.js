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

  function click(event) {
    const title = d3.select("#title");
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

    document
      .getElementsByClassName("selected-button")[0]
      .classList.remove("selected-button");
    event.target.classList.add("selected-button");
    title.html(`Average Men's ${this.textContent} Participants by sport`);

    const updatedBarChartData = data.sort((a, b) => {
      return d3.descending(a[metric], b[metric]);
    });
    update(updatedBarChartData);
  }

  d3.select("#participation-buttons").selectAll("button").on("click", click);

  const barChartData = data.sort((a, b) => {
    return d3.descending(a.HS_US_Boys, b.HS_US_Boys);
  });

  /* Sizing convention */
  const margin = { top: 60, left: 200, right: 90, bottom: 60 },
    width = 700 - margin.left - margin.right,
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
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Transitions
  const dur = 1000;
  //   const t = d3.transition().duration(dur);

  svg
    .selectAll(".bar")
    .data(data, (d) => d.Sport)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", (d) => yScale(d.Sport))
    .attr("height", (d) => yScale.bandwidth())
    .attr("data-sport", (d) => d.Sport)
    .attr("data-participation", (d) => d.HS_US_Boys)
    .on("mouseenter", mouseenter)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .transition()
    .delay((d, i) => i * 20)
    .duration(dur)
    .attr("width", (d) => xScale(d.HS_US_Boys))
    .style("fill", (d) => (d.Sport === "Tennis" ? "#0D76B7" : "#BBC5CF"));
  /* Add axes */
  const xAxisDraw = svg.append("g").attr("class", "x").call(xAxis);
  const yAxisDraw = svg.append("g").call(yAxis);

  /* Add data items and deal with updated items/axes/scales */
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
            .attr("data-sport", (d) => d.Sport)
            .attr("data-participation", (d) => d.HS_US_Boys)
            .on("mouseenter", mouseenter)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .transition()
            .delay((d, i) => i * 20)
            .duration(dur)
            .attr("width", (d) => xScale(d.HS_US_Boys))
            .style("fill", "#00b5e2");
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

    xAxisDraw.transition().duration(dur).call(xAxis.scale(xScale));
    yAxisDraw.transition().duration(dur).call(yAxis.scale(yScale));
  }

  /* tooltip and event listener functions */
  const tip = d3.select("#tooltip");
  const tipHeader = d3.select("#tooltip-header");
  const tipBody = d3.select("#tooltip-body");

  function mouseenter(event) {
    const selectedData = d3.select(this).data()[0];
    tip
      .style("left", event.clientX + "px")
      .style("top", event.clientY + "px")
      .transition()
      .style("opacity", 0.98);
    tipHeader.html("Sport: " + selectedData.Sport);
    tipBody.html("Participants: " + selectedData[metric].toLocaleString());
    d3.select("#tooltip").style("opacity", 0.98);
  }

  function mousemove(event) {
    tip.style("left", event.clientX + "px").style("top", event.clientY + "px");
  }

  function mouseleave(event) {
    tip.transition().style("opacity", 0);
  }
};

d3.csv("data/NCAA_Men.csv", type).then((res) => ready(res));

// data from: https://scholarshipstats.com/varsityodds
