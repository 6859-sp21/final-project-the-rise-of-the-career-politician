<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { winWidth, winHeight, bubbleN } from './stores.js';
    import * as d3 from 'd3';    
    import BubbleLegend from './BubbleLegend.svelte';
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
        x = event.detail.event.clientX + 5;
		y = event.detail.event.clientY + 5;
    }

    function mouseMove(event) {
        x = event.detail.event.clientX + 5;
		y = event.detail.event.clientY + 5;
	}

    function mouseOut(){
        isHovered = false;
    }

    let n = 50;
    let year = 2021;
    let running = false;
    let displayVar = 'cumulative_time_sen_and_house';
    let interval;
    const width = .4*$winWidth;
    const height = .6*$winHeight;

    function getLongestServing(data, year, n) {
        return data.congresses[year]
		 		.sort((x,y) => x[displayVar] < y[displayVar] ? 1: -1);
	};

    $: users = getLongestServing(data, $bubbleN, n);
    $: root = d3.pack().size([width - 2, height - 2])
                .padding(1)(d3.hierarchy({children: users})
                .sum(d => d[displayVar]).sort());

    $: leaves = root.leaves();
    
</script>

<h3>Distribution of experience in {$bubbleN}</h3>
<input type=range bind:value={$bubbleN} min=1790 max=2021>

<div>
    <svg width={width} height={height} transition:fade>
        {#each leaves as d}
            <Bubble 
                on:mouseover={mouseOver}
                on:mouseout={mouseOut}
                on:mousemove={mouseMove}
                bind:d={d}
                {displayVar}
            />
        {/each}
    </svg>
</div>
<BubbleLegend/>


{#if isHovered}
    <WikipediaToolTip bind:x bind:y bind:message/>
{/if}