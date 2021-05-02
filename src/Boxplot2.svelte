<script>
    import Axis from './Axis.svelte';
    import Outlier from './Outlier.svelte';
	import { fade, draw, fly } from 'svelte/transition';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    import { boxplotOutcomeVar } from './stores.js';
    export let data;

    let outcomeVar;
    let repType = 'both'

    boxplotOutcomeVar.subscribe(value => {
        outcomeVar = value;
    });

    let formattedOutcome = {
        'cumulative_time_sen_and_house': 'Years Served',
        'age': 'Age'
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

    // Boxplot drawing functions

    function getPath(d){
        return `
        M${x((d.x0 + d.x1) / 2)},${y(d.range[1])}
        V${y(d.range[0])}`;
    };

    function getPath2(d){
       return `
        M${x(d.x0) + 1},${y(d.quartiles[2])}
        H${x(d.x1)}
        V${y(d.quartiles[0])}
        H${x(d.x0) + 1}
        Z`;
    };

    function getPath3(d){
        return `
        M${x(d.x0) + 1},${y(d.quartiles[1])}
        H${x(d.x1)}`;
    };

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
            fill = white>Year</text>
        <Axis {width} {height} margin={margin.left} scale={y} position='left' />
        <text 
            text-anchor= "middle"
            fill = white
            transform = {`translate(${margin.left/3}, ${height/2}) rotate(270)`}
            >{formattedOutcome[outcomeVar]}</text>
            
        {#each bins as b (b.id)}
            <g>
                <path
                stroke=currentColor
                d={getPath(b)}
                transition:fade="{{duration: 1000}}"
                ></path>
                <path
                fill="#ddd"
                transition:fade="{{duration: 1000}}"
                d={getPath2(b)}></path>
                <path
                stroke=currentColor
                transition:fade="{{duration: 1000}}"
                d={getPath3(b)}></path>

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

<style>
    label {
        display: inline-block;
    }

    text {
        color: white;
    }
</style>