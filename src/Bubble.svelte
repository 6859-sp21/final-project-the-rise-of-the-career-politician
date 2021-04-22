<script>
    import { onMount } from 'svelte';
    export let users;

    let el;
    const width = 500;
    const height = 500;

    onMount(() => {
        const root = d3.pack()
         .size([width - 2, height - 2])
         .padding(3)
        (d3.hierarchy({children: users})
        .sum(d => d.time_sen_and_house))

        console.log(root);
        const svg = d3.select(el).append("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("font-size", 10)
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle");

        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
            .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        leaf.append("circle")
            // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
            .attr("r", d => d.r)
            .attr("fill-opacity", 0.7);
            //   .attr("fill", d => color(d.data.group));

        console.log(root.leaves())


    });
    // leaf.append("circle")
    //     .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
    //     .attr("r", d => d.r)
    //     .attr("fill-opacity", 0.7);
    //     //   .attr("fill", d => color(d.data.group));

    // leaf.append("clipPath")
    //     .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    //     .append("use")
    //     .attr("xlink:href", d => d.leafUid.href);

    // leaf.append("text")
    //     .attr("clip-path", d => d.clipUid)
    //     .selectAll("tspan")
    //     .data(d => d.data.wikipedia)
    //     .join("tspan")
    //     .attr("x", 0)
    //     .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    //     .text(d => d);
    
</script>

<div bind:this={el}></div>
<ul>
	{#each users as user}
		<li>
            {user.wikipedia} has served for {user.time_sen_and_house}
		</li>
	{/each}
</ul>