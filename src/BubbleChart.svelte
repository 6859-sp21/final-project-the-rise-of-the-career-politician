<script>
    import { onMount } from 'svelte';
    import Bubble from './Bubble.svelte';
    export let data;

    let isHovered = false;
    let imageLoaded = false;
    let image;
    let x;
    let y;
    let text = "default";

    function mouseOver(event) {
        isHovered = true;
        text = event.detail.text;
        if (event.detail.image !== "no image"){
            imageLoaded = true
            image = event.detail.image
            console.log("image:", image)
        }
        console.log(event.detail.image)
		x = event.detail.event.pageX + 5;
		y = event.detail.event.pageY + 5;
    }

    function mouseMove(event) {
        x = event.detail.event.pageX + 5;
		y = event.detail.event.pageY + 5;
	}

    function mouseOut(){
        isHovered = false;
    }

    let n = 50;
    let year = 2019;
    let el;
    const width = 800;
    const height = 800;

    function getLongestServing(data, year, n) {
        console.log('changed n ', n)
		return data.congresses[year]
		 		.sort((x,y) => x['time_sen_and_house'] < y['time_sen_and_house'])
		 		.slice(0, n);
	};

    $: users = getLongestServing(data, year, n);
    $: root = d3.pack().size([width - 2, height - 2])
                .padding(3)(d3.hierarchy({children: users})
                .sum(d => d.time_sen_and_house));

    $: leaves = root.leaves();
</script>

<p>Year: {year}</p>
<input type=range bind:value={year} min=1790 max=2019>


<input type=number bind:value={n} min=10 max=80>

<div>
    <svg width={width} height={height}>
        {#each leaves as d}
            <Bubble 
                on:mouseover={mouseOver}
                on:mouseout={mouseOut}
                on:mousemove={mouseMove}
                d={d}
            />
        {/each}
    </svg>
</div>

{#if isHovered}
	<div style="top: {y}px; left: {x}px;" class="tooltip">
        Tooltip
        {#await image}
		<p>...waiting</p>
    	{:then image}
        <img src={image} alt="here"/>
    	{:catch error}
		<p>An error occurred!</p>
	{/await}
    </div>
{/if}

<style>
    svg {
        z-index: -1;
    }

    .tooltip {
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
	}
</style>