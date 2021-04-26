<script>
    import Axis from './Axis.svelte';
    import { onMount } from 'svelte';
    export let data;
    export let xVar;
    export let yVar;
    export let colorVar;

    const width = 600;
    const height = 600;
    const margin = {top: 20, right: 30, bottom: 30, left: 40}

    let congressmen = data.congresses[2020];    
    console.log(congressmen)

    let x = d3.scaleLinear()
        .domain(d3.extent(congressmen, d => d[xVar])).nice()
        .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
        .domain(d3.extent(congressmen, d => d[yVar])).nice()
        .range([height - margin.bottom, margin.top])

    let colorScale = d3.scaleLinear()
        .domain(d3.extent(congressmen, d => d[colorVar])).nice()
        .range(["green", "brown"])

    let options = [
        {id: 'min_age', text: "Age when first joining Congress"},
        {id: 'cumulative_time_sen_and_house', text:'Total time spent in Congress'},
        {id: 'age', text:'Current age'},
        {id: 'nominate_dim1', text: 'Liberal-Conservative Dimension'},
        {id: 'nominate_dim2', text: 'Hot Topics Dimension'}
    ];

</script>

<div width=75% height=75%>
    <!-- <form>
        <select bind:value={xVar}>
            {#each options as o}
                <option value={o}>
                    {o.text}
                </option>
            {/each}
        </select>    
    </form> -->

    <svg viewBox={[0, 0, width, height]}
        width={width}
        height={height}>

        <Axis width={width} 
              height={height} 
              margin={margin.bottom} scale={x} position='bottom' />


        <Axis width={width} 
            height={height} 
            margin={margin.bottom} scale={y} position='left' />

        <g>
            {#each congressmen as d}
                <circle 
                transform={`translate(${x(d[xVar])},${y(d[yVar])})`}
                r=3
                fill={colorScale(d[colorVar])}></circle>
            {/each}
        </g>
    </svg>
</div>