<script>
    import Axis from './Axis.svelte';
    import { onMount } from 'svelte';
    export let data;
    export let xVar;
    export let yVar;

    let el;
    const width = 600;
    const height = 600;
    const margin = {top: 20, right: 30, bottom: 30, left: 40}

    // let congressmen = Object.values(data.congressmen)
    //                         .filter(d => d[xVar] != -99)
    //                         .filter(d => d[yVar] != -1)

    let congressmen = data.congresses[2020];    
    console.log(congressmen)

    let x = d3.scaleLinear()
        .domain(d3.extent(congressmen, d => d[xVar])).nice()
        .range([margin.left, width - margin.right])
    let y = d3.scaleLinear()
        .domain(d3.extent(congressmen, d => d[yVar])).nice()
        .range([height - margin.bottom, margin.top])

    function xAxis(g){
        g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", width - margin.right)
            .attr("y", -4)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(congressmen[xVar]));
    };

    function yAxis(g){
        g.attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 4)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(congressmen[yVar]));
    };

    onMount(() => {
        const svg = d3.select(el)
            .append("svg")
            .attr("height", 600)
            .attr("width", 600)
            .attr("viewBox", [0, 0, width, height])
            .property("value", []);

        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        const dot = svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(congressmen)
            .join("circle")
            .attr("transform", d => `translate(${x(d[xVar])},${y(d[yVar])})`)
            .attr("r", 3);
    });
        
</script>

<div bind:this={el} width=75% height=75%></div>