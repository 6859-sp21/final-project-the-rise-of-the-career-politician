<script>
    import Axis from './Axis.svelte';
    import Legend from './Legend.svelte';
    import Scat from './Scat.svelte';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';

    import { scatterPlotColorVar, scatterPlotSizeVar, scatterPlotXVar, scatterPlotYVar,
             winWidth, winHeight} from './stores.js';
    import ScatterOptions from "./ScatterOptions.svelte";
    import ColorLegend from './ColorLegend.svelte';
    export let data;


    const formattedLabels = {
        'nominate_dim1': 'Ideology Score (liberal-conservative)',
        'nominate_dim2': 'Ideology Score ("hot topics" dimension)',
        'min_age': 'Age on Entering Congress',
        'max_age': 'Max Age in Congress',
        'age': 'Current Age',
        'cumulative_time_sen_and_house': 'Total Time in Congress',
        "cosponsored": '# of Bills Cosponsored',
        "bills-introduced": '# of Bills Introduced',
        // "bills-reported": '# of Bills Gone Out of Committee',
        'bills-enacted-ti': '# of Bills that Became Law',
        // "leadership": 'Leadership Score',
        "missed-votes": "% of Votes Missed",
        // "bills-with-committee-leaders": "# of Bills with Committee Chair Cosponsors ",
        "bills-with-cosponsor-other-party": "# of Bipartisan Bills",
        "committee-positions": '# of Committee Positions'
    }
    
    const formattedLabelsShort = {
        'nominate_dim1': 'Ideology Score',
        'min_age': 'Age on Entry',
        'max_age': 'Max Age',
        'age': 'Current Age',
        'cumulative_time_sen_and_house': 'Total Time',
    }
    const margin = ({top: 20, right: 100, bottom: 60, left: 50})
    const width = .4*$winWidth - margin.left - margin.right;
    const height = .6*$winHeight - margin.top - margin.bottom;

    let congressmen; 
    let xScale;
    let yScale;
    let colorScale;
    let sizeScale;
    $: {
        congressmen = data.congresses[2020]
            .filter(d => d[$scatterPlotXVar] != undefined)
            .filter(d => d[$scatterPlotYVar] != undefined)
            .filter(d => ! isNaN(d[$scatterPlotXVar]))
            .filter(d => ! isNaN(d[$scatterPlotYVar]))
            .map(d => ({ ...d, 
                x: Number(d[$scatterPlotXVar]),
                y: Number(d[$scatterPlotYVar]) }))
            .filter(d => d[$scatterPlotColorVar] != undefined)
            .filter(d => d.x !== -99 && d.y !== -99);
        
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
        message = event;
        isHovered = true;
		xTool = event.detail.event.clientX - 5;
		yTool = event.detail.event.clientY - 5;
    }

    function mouseMove(event) {
        xTool = event.detail.event.clientX - 5;
		yTool = event.detail.event.clientY - 5;
	}

    function mouseOut(){
        isHovered = false;
    }
</script>

<div class="scatterplot">

    <svg viewBox={[0, 0, width, height]}
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

        <g>
            {#each congressmen as d}
                <Scat {d} x={xScale(d.x)} y={yScale(d.y)} 
                color={colorScale(d[$scatterPlotColorVar])}
                r={sizeScale(d[$scatterPlotSizeVar])}
                on:mouseover={mouseOver}
                on:mouseout={mouseOut}
                on:mousemove={mouseMove}/>
            {/each}
        </g>
    </svg>
</div>

<ScatterOptions options={formattedLabels}/>

{#if isHovered}
    <WikipediaToolTip bind:x={xTool} bind:y={yTool} 
    bind:message otherFields={true}/>
{/if}

<style>
    text {
        color: black;
    }
</style>