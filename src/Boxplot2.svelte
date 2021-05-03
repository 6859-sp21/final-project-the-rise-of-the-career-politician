<script>
    import Axis from './Axis.svelte';
    import Outlier from './Outlier.svelte';
	import { fade, draw, fly } from 'svelte/transition';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    import Box from './Box.svelte';
    import { boxplotOutcomeVar, boxplotRepType} from './stores.js';
    import BoxTooltip from './BoxTooltip.svelte';
    export let data;

    let outcomeVar;
    let repType; 

    boxplotOutcomeVar.subscribe(value => {
        outcomeVar = value;
    });

    boxplotRepType.subscribe(value => {
        repType = value;
    });

    let formattedOutcome = {
        'cumulative_time_sen_and_house': 'Years Served',
        'age': 'Age',
        'nominate_dim1': 'Ideology Score (liberal-conservative)'
    }
    function getBins(outcomeVar, repType){
        let newData = new Array();
        let bins;
        let years = new Array();
        for (let year = 1790; year <= 2019; year++) 
            years.push(year);
        
        years.forEach(year => {
            data.congresses[year].forEach(d => {
                newData.push({x: year, 
                            y: d[outcomeVar],
                            data: d});            
            });
        });

        if (repType !== 'both'){
            newData = newData.filter(d => d.data.type === repType)
        }

        if (outcomeVar === "age")
            newData = newData.filter(d => d.y > 20);
        bins = d3.histogram()
        .thresholds(23)
        .value(d => d.x)(newData)
        .map(bin => {
            bin.sort((a, b) => a.y - b.y);
            const values = bin.map(d => d.y);
            const min = values[0];
            const max = values[values.length - 1];
            const q1 = d3.quantile(values, 0.25);
            const q2 = d3.quantile(values, 0.50);
            const q3 = d3.quantile(values, 0.75);
            const iqr = q3 - q1; // interquartile range
            const r0 = Math.max(min, q1 - iqr * 1.5);
            const r1 = Math.min(max, q3 + iqr * 1.5);
            bin.quartiles = [q1, q2, q3];
            bin.range = [r0, r1];
            bin.absRange = [min, max];
            bin.outliers = bin.filter(v => v.y < r0 || v.y > r1); // TODO

            // Drop duplicates from outliers
            const uniqueIds = new Set();
            const newOutliers = new Array();
            bin.outliers.reverse().forEach(d => {
                if (!uniqueIds.has(d.data.id)){
                    uniqueIds.add(d.data.id);
                    newOutliers.push(d);
                }
            });
            bin.outliers = newOutliers;

            bin.id = outcomeVar + '/' + repType + '/' + bin.x0;
            return bin;
        })
        let x =  d3.scaleLinear()
            .domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)])
            .rangeRound([margin.left, width - margin.right])

        let y = d3.scaleLinear()
            .domain([d3.min(bins, d => d.absRange[0]), d3.max(bins, d => d.absRange[1])]).nice()
            .range([height - margin.bottom, margin.top])
        
        return {bins, x, y}
    };
    
    let margin = ({top: 20, right: 20, bottom: 60, left: 50})
    let height = 600;
    let width = 600;
    let bins; let x; let y;
    $: {
        let returnVal = getBins(outcomeVar, repType);
        bins = returnVal.bins;
        x = returnVal.x;
        y = returnVal.y;
    }
    // Tool tip
    let isHovered = false;
    let message;
    let xTool;
    let yTool;

    function mouseOver(event) {
        message = event;
        isHovered = true;
		xTool = event.detail.event.clientX + 5;
		yTool = event.detail.event.clientY + 5;
    }

    function mouseMove(event) {
        xTool = event.detail.event.clientX + 5;
		yTool = event.detail.event.clientY + 5;
	}

    function mouseOut(){
        isHovered = false;
    }

    //Boxplot tooltip
    let isHoveredBox = false;
    let messageBox;
    let xToolBox;
    let yToolBox;

    function mouseOverBox(event) {
        messageBox = event;
        isHoveredBox = true; 
        xToolBox = event.detail.event.clientX;
        yToolBox = event.detail.event.clientY;
    }

    function mouseMoveBox(event) {
        xToolBox = event.detail.event.clientX;
		yToolBox = event.detail.event.clientY;
	}

    function mouseOutBox(){
        isHoveredBox = false;
    }

</script>
<div>
    <h2>{formattedOutcome[outcomeVar]} In Congress Over Time</h2>
    <form class="radio-inline">
        <label>
            <input type=radio bind:group={outcomeVar} value={'cumulative_time_sen_and_house'}>
            Time in Congress
        </label>
        
        <label>
            <input type=radio bind:group={outcomeVar} value={'age'}>
            Age
        </label>    

    </form>

    <form>
        <label>
            <input type=radio bind:group={repType} value={'both'}>
            Both
        </label>

        <label>
            <input type=radio bind:group={repType} value={'sen'}>
            Senate
        </label>
    
        <label>
            <input type=radio bind:group={repType} value={'rep'}>
            House
        </label>
    </form>

    <svg width={width} height={height}>
        <Axis width={width} 
              height={height} 
              margin={margin.bottom} scale={x} position='bottom-date' />
        <text 
            text-anchor= "middle"
            x = {width/2}
            y = {height - margin.bottom/3}
            fill = black>Year</text>
        <Axis {width} {height} margin={margin.left} scale={y} position='left' />
        <text 
            text-anchor= "middle"
            fill = black
            transform = {`translate(${margin.left/3}, ${height/2}) rotate(270)`}
            >{formattedOutcome[outcomeVar]}</text>
            
        {#each bins as b (b.id)}
            <g>
                <Box {b} {x} {y}
                on:mouseover={mouseOverBox}
                on:mouseout={mouseOutBox}
                on:mousemove={mouseMoveBox}/>

                <g fill="#888" fill-opacity=.5 stroke=none
                transition:fade="{{duration: 1000}}"
                transform={`translate(${x((b.x0 + b.x1) / 2)}, 0)`}>
                    {#each b.outliers as o}
                        <Outlier {y} d={o}
                        on:mouseover={mouseOver}
                        on:mouseout={mouseOut}
                        on:mousemove={mouseMove}
                        />
                    {/each}
                </g>
            </g> 
        {/each}
    </svg>
</div>

{#if isHovered}
    <WikipediaToolTip bind:x={xTool} bind:y={yTool} bind:message/>
{/if}

{#if isHoveredBox}
    <BoxTooltip bind:xToolBox={xToolBox} bind:yToolBox={yToolBox} bind:messageBox={messageBox}
    label={formattedOutcome[outcomeVar]}/>
{/if}

<style>
    label {
        display: inline-block;
    }

    text {
        color: black;
    }
</style>