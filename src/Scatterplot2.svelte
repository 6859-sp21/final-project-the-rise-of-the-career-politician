<script>
    import Axis from './Axis.svelte';
    import Legend from './Legend.svelte';
    import Scat from './Scat.svelte';
    import { fade } from 'svelte/transition';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    import { onMount } from 'svelte';
    import {annotation, annotationCalloutElbow} from 'd3-svg-annotation';

    import * as d3 from 'd3';

    import { scatterPlotColorVar, scatterPlotSizeVar, scatterPlotXVar, scatterPlotYVar,
             winWidth, winHeight, scatterPlotYear, scatterShowAnnotation, 
             scatterHighlighted, scatterRepType } from './stores.js';
    import ScatterOptions from "./ScatterOptions.svelte";
    import ColorLegend from './ColorLegend.svelte';
    import SearchBar from './SearchBar.svelte';
    export let data;

    let scatter


    const formattedLabels = {
        'nominate_dim1': 'Ideology Score (liberal-conservative)',
        'nominate_dim2': 'Ideology Score ("hot topics" dimension)',
        'min_age': 'Age on Entering Congress',
        // 'max_age': 'Max Age in Congress',
        'age': 'Current Age',
        'cumulative_time_sen_and_house': 'Total Time in Congress',
        "cosponsored": '# of Bills Cosponsored',
        "bills_introduced": '# of Bills Introduced',
        // "bills-reported": '# of Bills Gone Out of Committee',
        'bills_enacted_ti': '# of Bills that Became Law',
        // "leadership": 'Leadership Score',
        "missed_votes": "% of Votes Missed",
        // "bills-with-committee-leaders": "# of Bills with Committee Chair Cosponsors ",
        "bills_with_cosponsor_other_party": "# of Bipartisan Bills",
        "committee_positions": '# of Committee Positions'
    }
    
    const formattedLabelsShort = {
        'nominate_dim1': 'Ideology Score',
        'min_age': 'Age on Entry',
        'max_age': 'Max Age',
        'age': 'Current Age',
        'cumulative_time_sen_and_house': 'Total Time',
    }
    const margin = ({top: 20, right: 100, bottom: 60, left: 50})
    const width = .6*$winWidth - margin.left - margin.right;
    const height = .7*$winHeight - margin.top - margin.bottom;

    let congressmen; 
    let xScale;
    let yScale;
    let colorScale;
    let sizeScale;
    $: {
        congressmen = data.congresses[$scatterPlotYear]
            .filter(d => d[$scatterPlotXVar] != undefined)
            .filter(d => d[$scatterPlotYVar] != undefined)
            .filter(d => ! isNaN(d[$scatterPlotXVar]))
            .filter(d => ! isNaN(d[$scatterPlotYVar]))
            .map(d => ({ ...d, 
                x: Number(d[$scatterPlotXVar]),
                y: Number(d[$scatterPlotYVar]) }))
            .filter(d => d[$scatterPlotColorVar] != undefined)
            .filter(d => d.x !== -99 && d.y !== -99);

        if ($scatterRepType !== "both")
            congressmen = congressmen.filter(d => d.type === $scatterRepType)
        
        xScale = d3.scaleLinear()
            .domain(d3.extent(congressmen, d => d.x)).nice()
            .range([margin.left, width - margin.right])

        yScale = d3.scaleLinear()
            .domain(d3.extent(congressmen, d => d.y)).nice()
            .range([height - margin.bottom, margin.top])

        if ($scatterPlotColorVar === "nominate_dim1"){
            colorScale = d3.scaleLinear()
                .domain([-.8, 0, .8]).nice()
                .range(["blue", "white", "red"])
        } else {
            colorScale = d3.scaleLinear()
            .domain(d3.extent(congressmen, d => d[$scatterPlotColorVar])).nice()
            .range(["white", "blue"])
        }
        
        sizeScale = d3.scaleLinear()
            .domain(d3.extent(congressmen, d => d[$scatterPlotSizeVar])).nice()
            .range([2,8])
        }

    // Tool tip
    let isHovered = false;
    let message;
    let xTool;
    let yTool;

    function mouseOver(event) {
        scatterShowAnnotation.set(false);
        message = event;
        isHovered = true;
		xTool = event.detail.event.clientX;
		yTool = event.detail.event.clientY;
        if (yTool > .5*height) yTool -= .3*height
    }

    function mouseMove(event) {
        xTool = event.detail.event.clientX;
		yTool = event.detail.event.clientY;
        if (yTool > .5*height) yTool -= .3*height
	}

    function mouseOut(){
        isHovered = false;
    }

    // Search bar
    function handleMessage(event) {
        if (event.detail.text === "clear-labels") {
            $scatterHighlighted = [];
            d3.select(scatter).selectAll('text').remove()
        } else {
            $scatterHighlighted = [...$scatterHighlighted, event.detail.text];
        }
    }

    $: {
        scatterHighlighted.subscribe((a) => {
            d3.select(scatter).selectAll('text').remove();
            if (a.length > 0) {
                let toPlot = a.map(x => congressmen.find(d => d.official_full == x));
                d3.select(scatter)
                    .selectAll('text')
                    .data(toPlot)//, d => d.id)
                    .join('text')
                    .attr('x', d => xScale(d[$scatterPlotXVar]))
                    .attr('y', d => yScale(d[$scatterPlotYVar]) - 5)
                    .style('font-size', '12px')
                    .style("stroke", "black")
                    .style('text-anchor', 'middle')
                    // .style("stroke", "black")
                    .text(d => d.official_full);

            }
        });
    }

    // Annotations
    let mySvg;
    function addAnnotation() {
        let bernie = congressmen.find(x => x.official_full === "Chuck Grassley");
        const annotations = [{
            note: {label: "Each point is sized by length of tenure and colored by ideology. Hover over a point to reveal more details.",
            bgPadding: 10},
            x: xScale(bernie.x),
            y: yScale(bernie.y),
            className: "show-bg",
            dy: 0,
            dx: width/7,
            color: "black",
            type: annotationCalloutElbow,
            connector: {end: "arrow", endscale: 10},
            subject: {
                radius: bernie.r + 10,
                radiusPadding: 10
            },
        }];

        const makeAnnotations = annotation()
            .notePadding(15)
            .annotations(annotations)

        d3.select(mySvg)
            .append("g")
            .attr("class", "annotation-group-scatter")
            .style("background-color", "rgba(230, 242, 255, 0.8)")
            .style("border-radius", "5px")
            .call(makeAnnotations)
    }
    onMount(() => {addAnnotation()});
    $: { //Once someone has hovered 
        if (! $scatterShowAnnotation) {
            setTimeout(function() {
                d3.select(mySvg)
                    .selectAll(".annotation-group-scatter")
                    .transition().duration(2000)
                    .style('fill-opacity', 0)
                    .style('stroke-opacity', 0)
                    .remove()
            }, 100);
        }
    }
</script>

<div class="scatterplot">
    <h2>Congress in {$scatterPlotYear}</h2>
    <svg bind:this={mySvg} viewBox={[0, 0, width, height]}
        width={width}
        height={height}>

        <Axis width={width} 
              height={height} 
              margin={margin.bottom} scale={xScale} position='bottom' />

        <text 
        text-anchor= "middle"
        x = {width/2}
        y = {height - margin.bottom/3}
        fill = black>{formattedLabels[$scatterPlotXVar]}</text>

        <Axis width={width} 
            height={height} 
            margin={margin.left} scale={yScale} position='left' />

        <Legend 
            title={formattedLabels[$scatterPlotSizeVar]}
            scale={sizeScale}
            xCircle={width-100}
            yCircle={height/3}/>

        <ColorLegend
            width={10}
            height={100}
            scale={colorScale}
            xStart={width-25}
            yStart={height/3}
            title={formattedLabelsShort[$scatterPlotColorVar]}
        />
        <text 
        text-anchor= "middle"
        fill = black
        transform = {`translate(${margin.left/3}, ${height/2}) rotate(270)`}
        >{formattedLabels[$scatterPlotYVar]}</text>

        {#key congressmen}
        <g transition:fade={{duration: 1000}} bind:this={scatter}>
            {#each congressmen as d}
                    <Scat {d} x={xScale(d.x)} y={yScale(d.y)} 
                    color={colorScale(d[$scatterPlotColorVar])}
                    r={sizeScale(d[$scatterPlotSizeVar])}
                    on:mouseover={mouseOver}
                    on:mouseout={mouseOut}
                    on:mousemove={mouseMove}/>
            {/each}
        </g>
        {/key}
    </svg>
</div>

{#if congressmen.length === 0}
<div class="error">
    <h3> No data available for this query </h3>
</div>
{/if}

<SearchBar data={congressmen} on:message={handleMessage}/>
<ScatterOptions options={formattedLabels}/>

{#if isHovered}
    <WikipediaToolTip bind:x={xTool} bind:y={yTool} 
    bind:message otherFields={true}/>
{/if}

<style>
    text {
        color: black;
    }

    h3 {
        color: red;
    }
</style>