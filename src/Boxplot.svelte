<script>
    import Axis from './Axis.svelte';
    import Outlier from './Outlier.svelte';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    export let data;
    let newData = new Array();
    let bins;
    let outcomeVar = 'cumulative_time_sen_and_house';
    let years = new Array();
    for (let year = 1790; year <= 2019; year += 10) 
        years.push(year);
    
    years.push(2019);
    console.log(data.congresses)
    console.log(data.congresses[2019].filter(d => d.state == "WV"))
    console.log(data.congresses[2019].find(d => d.official_full === "Robert Byrd"))


    years.forEach(year => {
        data.congresses[year].forEach(d => {
            newData.push({x: year, 
                          y: d[outcomeVar],
                          data: d});            
        });
    });

    bins = d3.histogram()
    .thresholds(years)
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
        return bin;
    })

    console.log(bins)

    let margin = ({top: 20, right: 20, bottom: 60, left: 50})
    let height = 600;
    let width = 600;
    let x =  d3.scaleLinear()
        .domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)])
        .rangeRound([margin.left, width - margin.right])

    let y = d3.scaleLinear()
        .domain([d3.min(bins, d => d.absRange[0]), d3.max(bins, d => d.absRange[1])]).nice()
        .range([height - margin.bottom, margin.top])

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
		xTool = event.detail.event.pageX + 5;
		yTool = event.detail.event.pageY + 5;
    }

    function mouseMove(event) {
        xTool = event.detail.event.pageX + 5;
		yTool = event.detail.event.pageY + 5;
	}

    function mouseOut(){
        isHovered = false;
    }

</script>
<div>
    <h2># of Years In Congress Over Time</h2>
    <svg width={width} height={height}>
        <Axis width={width} 
              height={height} 
              margin={margin.bottom} scale={x} position='bottom' />
        <text 
            text-anchor= "middle"
            x = {width/2}
            y = {height - margin.bottom/3}>Year</text>
        <Axis {width} {height} margin={margin.left} scale={y} position='left' />
        <text 
            text-anchor= "middle"
            transform = {`translate(${margin.left/3}, ${height/2}) rotate(270)`}
            >Years in Congress</text>
            
        {#each bins as b}
            <g>
                <path
                stroke=currentColor
                d={getPath(b)}></path>
                <path
                fill="#ddd"
                d={getPath2(b)}></path>
                <path
                stroke=currentColor
                d={getPath3(b)}></path>

                <g fill="#888" fill-opacity=.5 stroke=none
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