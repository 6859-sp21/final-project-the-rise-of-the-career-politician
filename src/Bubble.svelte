<script>
    import { onMount } from 'svelte';
    export let users;

    let el;
    const width = 500;
    const height = 500;

    onMount(() => {
        const color = d3.scaleOrdinal(users.map(d => d.party), d3.schemeCategory10)
        
        const sizeScalar = d3.scaleLinear()
                       .domain(d3.extent(users.map(d => d.time_sen_and_house)))
                       .range([0, 5])

        const root = d3.pack()
         .size([width - 2, height - 2])
         .padding(3)(d3.hierarchy({children: users})
                       .sum(d => d.time_sen_and_house))

        const svg = d3.select(el).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("font-size", 8)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");

        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        leaf.append("circle")
            .attr("r", d => d.r)
            .attr("fill-opacity", 0.7)
            .attr("fill", d => color(d.data.party));

        leaf.append("text")
            .data(root.leaves())
            .join("text")
            .attr("x", 0)
            .attr("y", 0)
            .text(d => d.data.wikipedia);

    });

</script>

<style>
    .bubblechart {
        width: 40%;
        margin: 0 auto;
    }
</style>

<div bind:this={el} class="bubblechart"></div>
<ul>
	{#each users as user}
		<li>
            {user.wikipedia} has served for {user.time_sen_and_house}
		</li>
	{/each}
</ul>