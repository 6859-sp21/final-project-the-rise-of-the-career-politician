<script>
  import Axis from "./Axis.svelte";
  import Outlier from "./Outlier.svelte";
  import { fade, draw, fly } from "svelte/transition";
  import WikipediaToolTip from "./WikipediaToolTip.svelte";
  import Box from "./Box.svelte";
  import { boxplotOutcomeVar, boxplotRepType, winWidth, winHeight, 
      showLifeExpectancy, boxplotShowAnnotation } from "./stores.js";
  import BoxTooltip from "./BoxTooltip.svelte";
  import {lifeExpectancy} from "./lifeExpectancy";
  import * as d3 from 'd3';
  import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';
  import { onMount } from "svelte";
  export let data;

  let formattedOutcome = {
    cumulative_time_sen_and_house: "Years Served",
    age: "Age",
    nominate_dim1: "Ideology Score (liberal-conservative)",
    min_age: "Age at Start of Career"
  };

  function getBins(outcomeVar, repType) {
    let newData = new Array();
    let bins;
    let years = new Array();
    for (let year = 1790; year <= 2019; year++) years.push(year);

    years.forEach((year) => {
      data.congresses[year].forEach((d) => {
        newData.push({ x: year, y: d[outcomeVar], data: d });
      });
    });

    if (repType !== "both") {
      newData = newData.filter((d) => d.data.type === repType);
    }

    if (outcomeVar === "age" || outcomeVar == "min_age") newData = newData.filter((d) => d.y > 20);
    bins = d3
      .histogram()
      .thresholds(23)
      .value((d) => d.x)(newData)
      .map((bin) => {
        bin.sort((a, b) => a.y - b.y);
        const values = bin.map((d) => d.y);
        const min = values[0];
        const max = values[values.length - 1];
        const q1 = d3.quantile(values, 0.25);
        const q2 = d3.quantile(values, 0.5);
        const q3 = d3.quantile(values, 0.75);
        const iqr = q3 - q1; // interquartile range
        const r0 = Math.max(min, q1 - iqr * 1.5);
        const r1 = Math.min(max, q3 + iqr * 1.5);
        bin.quartiles = [q1, q2, q3];
        bin.range = [r0, r1];
        bin.absRange = [min, max];
        bin.outliers = bin.filter((v) => v.y < r0 || v.y > r1); // TODO

        // Drop duplicates from outliers
        const uniqueIds = new Set();
        const newOutliers = new Array();
        bin.outliers.reverse().forEach((d) => {
          if (!uniqueIds.has(d.data.id)) {
            uniqueIds.add(d.data.id);
            newOutliers.push(d);
          }
        });
        bin.outliers = newOutliers;

        bin.id = outcomeVar + "/" + repType + "/" + bin.x0;
        return bin;
      });
    let x = d3
      .scaleLinear()
      .domain([d3.min(bins, (d) => d.x0), d3.max(bins, (d) => d.x1)])
      .rangeRound([margin.left, width - margin.right]);

    let y = d3
      .scaleLinear()
      .domain([
        d3.min(bins, (d) => d.absRange[0]),
        d3.max(bins, (d) => d.absRange[1]),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    return { bins, x, y };
  }

  let margin = { top: 20, right: 20, bottom: 60, left: 50 };
  const width = .55*$winWidth - margin.left - margin.right;
  const height = .7*$winHeight - margin.top - margin.bottom;
  // let height = 600;
  // let width = 600;
  let bins;
  let x;
  let y;
  let line;
  let lineData = lifeExpectancy.map(d => ({year: d[0], value: d[1]}))

  $: {
    let returnVal = getBins($boxplotOutcomeVar, $boxplotRepType);
    bins = returnVal.bins;
    x = returnVal.x;
    y = returnVal.y;
    line = d3.line()
      .defined(d => !isNaN(d.value))
      .x(d => x(d.year))
      .y(d => y($boxplotOutcomeVar === "age" || $boxplotOutcomeVar === "min_age"? d.value : d.value-30))(lineData)
  }

  // Tooltip
  let showBox = false;
  let showOutlier = false;
  let message;
  let xTool;
  let yTool;

  function mouseOver(event) {
    boxplotShowAnnotation.set(false);
    message = event;
    message.detail.text === "I am box" ? showBox = true : showOutlier = true
    xTool = event.detail.event.clientX;
    yTool = event.detail.event.clientY - .4*height;
  }

  function mouseMove(event) {
    xTool = event.detail.event.clientX;
    yTool = event.detail.event.clientY - .4*height;
  }

  function mouseOut(event) {
    event.detail.text === "I am box" ? showBox = false : showOutlier = false;
  }

  function mouseClick(event) {
    let bin = event.detail.data;
  }

  // Annotation
  let mySvg;

  function addAnnotation() {
    let temp = bins[6];
    let outlier = temp.outliers[0];
    const annotations = [{
      note: {label: "Hover over a box to see precise numbers for each decade",
      bgPadding: 10},
      x: x((temp.x0 + temp.x1)/2),
      y: y(temp.quartiles[1]),
      className: "show-bg",
      dy: -height/2,
      dx: -width/10,
      color: "black",
      type: annotationCalloutElbow,
      connector: {end: "arrow", endscale: 10},
    }, 
  {
    note: {label: "Hover over an outlier to see which member of Congress it is",
      bgPadding: 10},
      x: x(outlier.x),
      y: y(outlier.y),
      className: "show-bg",
      dy: -height/5,
      dx: width/10,
      color: "black",
      type: annotationCalloutElbow,
      connector: {end: "arrow", endscale: 10},
      subject: {
                radius: 3 + 10,
                radiusPadding: 20
            },
  }];

   const makeAnnotations = annotation()
        .notePadding(15)
        .annotations(annotations)

    d3.select(mySvg)
        .append("g")
        .attr("class", "annotation-group-box")
        .style("background-color", "rgba(230, 242, 255, 0.8)")
        .style("border-radius", "5px")
        .call(makeAnnotations)
    }
 
  onMount(() => addAnnotation()); 

  $: { //Once someone has hovered 
      if (! $boxplotShowAnnotation) {
          setTimeout(function() {
              d3.select(mySvg)
                  .selectAll(".annotation-group-box")
                  .transition().duration(2000)
                  .style('fill-opacity', 0)
                  .style('stroke-opacity', 0)
                  .remove()
          }, 100);
      }
  }
</script>

<div>
  <h2>{formattedOutcome[$boxplotOutcomeVar]} In Congress Over Time</h2>
  <form class="radio-inline">
    <label>
      <input
        type="radio"
        bind:group={$boxplotOutcomeVar}
        value={"cumulative_time_sen_and_house"}
      />
      Time in Congress
    </label>

    <label>
      <input type="radio" bind:group={$boxplotOutcomeVar} value={"age"} />
      Age
    </label>

    <label>
      <input type="radio" bind:group={$boxplotOutcomeVar} value={"min_age"} />
      Age at Career Start
    </label>
  </form>

    <form>
      <label>
        <input type="radio" bind:group={$boxplotRepType} value={"both"} />
        Both
      </label>

      <label>
        <input type="radio" bind:group={$boxplotRepType} value={"sen"} />
        Senate
      </label>

      <label>
        <input type="radio" bind:group={$boxplotRepType} value={"rep"} />
        House
      </label>
    </form>

  <form>
    <label>
      <input type=checkbox bind:checked={$showLifeExpectancy}>
      Overlay life expectancy
    </label>
  </form>

  <svg {width} {height} bind:this={mySvg}>
    <Axis
      {width}
      {height}
      margin={margin.bottom}
      scale={x}
      position="bottom-date"
    />
    <text
      text-anchor="middle"
      x={width / 2}
      y={height - margin.bottom / 3}
      fill="black">Year</text
    >
    <Axis {width} {height} margin={margin.left} scale={y} position="left" />
    <text
      text-anchor="middle"
      fill="black"
      transform={`translate(${margin.left / 3}, ${height / 2}) rotate(270)`}
      >{formattedOutcome[$boxplotOutcomeVar]}</text
    >

    {#each bins as b (b.id)}
      <g>
        <Box
          {b}
          {x}
          {y}
          on:mouseover={mouseOver}
          on:mouseout={mouseOut}
          on:mousemove={mouseMove}
          on:click={mouseClick}
        />

        <g
          fill="#888"
          fill-opacity=".5"
          stroke="none"
          transition:fade={{ duration: 1000 }}
          transform={`translate(${x((b.x0 + b.x1) / 2)}, 0)`}
        >
          {#each b.outliers as o}
            <Outlier
              {x}
              {y}
              d={o}
              on:mouseover={mouseOver}
              on:mouseout={mouseOut}
              on:mousemove={mouseMove}
            />
          {/each}

        </g>
      </g>
    {/each}

    {#if $showLifeExpectancy }
      <path d={line} stroke="blue" fill="none" transition:fade={{ duration: 1000 }}></path>
    {/if}
  </svg>

  {#if $showLifeExpectancy }
    {#if $boxplotOutcomeVar === "age" || $boxplotOutcomeVar === "min_age"}
      <p transition:fade={{ duration: 1000 }}>Showing life expectancy in blue</p>  
    {:else}
    <p transition:fade={{ duration: 1000 }}>Showing <strong>adjusted</strong> life expectancy in blue</p>
    {/if}    
  {/if}
</div>

{#if showOutlier}
  <WikipediaToolTip bind:x={xTool} bind:y={yTool} bind:message />
{/if}

{#if showBox}
  <BoxTooltip
    bind:xTool
    bind:yTool
    bind:message
    label={formattedOutcome[$boxplotOutcomeVar]}
  />
{/if}

<style>
  label {
    display: inline-block;
  }

  text {
    color: black;
  }

  p {
    color: blue;
  }
</style>
