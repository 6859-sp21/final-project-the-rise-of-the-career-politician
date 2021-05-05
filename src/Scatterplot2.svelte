<script>
    import Axis from './Axis.svelte';
    import Legend from './Legend.svelte';
    import Scat from './Scat.svelte';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    import { onMount } from 'svelte';
    import { scatterPlotColorVar, scatterPlotSizeVar, scatterPlotXVar, scatterPlotYVar} from './stores.js';

    import ColorLegend from './ColorLegend.svelte';
    export let data;

    const formattedLabels = {
        'nominate_dim1': 'Ideology Score (liberal-conservative)',
        'min_age': 'Age on Entering Congress',
        'max_age': 'Max Age in Congress',
        'age': 'Current Age',
        'cumulative_time_sen_and_house': 'Total Time in Congress',
    }

    const margin = ({top: 20, right: 20, bottom: 60, left: 50})
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

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
    let options = [
        {id: 'min_age', text: "Age when first joining Congress"},
        {id: 'cumulative_time_sen_and_house', text:'Total time spent in Congress'},
        {id: 'age', text:'Current age'},
        {id: 'nominate_dim1', text: 'Liberal-Conservative Dimension'},
        {id: 'nominate_dim2', text: 'Hot Topics Dimension'}
    ];

    // Tool tip
    let isHovered = false;
    let message;
    let xTool;
    let yTool;

    function mouseOver(event) {
        console.log('mouse over happening', event)
        message = event;
        isHovered = true;
		xTool = event.detail.event.clientX - 25;
		yTool = event.detail.event.clientY - 25;
    }

    function mouseMove(event) {
        xTool = event.detail.event.clientX - 25;
		yTool = event.detail.event.clientY - 25;
	}

    function mouseOut(){
        isHovered = false;
    }
</script>

<div width=75% height=75%>
    <form class="scatterplot-options">
        x-axis: 
        <select bind:value={$scatterPlotXVar}>
            {#each options as o}
            <option value={o.id}>
                {o.text}
            </option>
            {/each}
        </select>
        y-axis: 
        <select bind:value={$scatterPlotYVar}>
            {#each options as o}
            <option value={o.id}>
                {o.text}
            </option>
            {/each}
        </select>
        color: 
        <select bind:value={$scatterPlotColorVar}>
            {#each options as o}
            <option value={o.id}>
                {o.text}
            </option>
            {/each}
        </select>
        size: 
        <select bind:value={$scatterPlotSizeVar}>
            {#each options as o}
            <option value={o.id}>
                {o.text}
            </option>
            {/each}
        </select>
    </form>

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
            values={[5,20,40]}
            xCircle={width-100}
            ycircle={margin.bottom}/>

        <ColorLegend
            width={10}
            height={100}
            scale={colorScale}
            title={formattedLabels[$scatterPlotColorVar] + 'Scale'}
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


{#if isHovered}
    <WikipediaToolTip bind:x={xTool} bind:y={yTool} bind:message/>
{/if}

<style>
    label {
        display: inline-block;
        padding: 10px;
    }

    text {
        color: black;
    }
</style>