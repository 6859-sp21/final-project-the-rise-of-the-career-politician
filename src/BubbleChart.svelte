<script>
    import { onMount } from 'svelte';
    import Bubble from './Bubble.svelte';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    export let data;

    let isHovered = false;
    let message;
    let x;
    let y;

    function mouseOver(event) {
        message = event;
        isHovered = true;
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

    const width = 800;
    const height = 800;

    function getLongestServing(data, year, n) {
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

<p>The year is: {year}</p>
<input type=range bind:value={year} min=1790 max=2019>

<input type=number bind:value={n} min=20 max=120>

<div>
    <svg width={width} height={height}>
        {#each leaves as d}
            <Bubble 
                on:mouseover={mouseOver}
                on:mouseout={mouseOut}
                on:mousemove={mouseMove}
                bind:d={d}
            />
        {/each}
    </svg>
</div>

{#if isHovered}
    <WikipediaToolTip bind:x bind:y bind:message/>
{/if}
