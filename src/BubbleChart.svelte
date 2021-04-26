<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

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
    let year = 2021;
    let running = false;
    let displayVar = 'cumulative_time_sen_and_house';
    let interval;
    const width = 600;
    const height = 600;

    function getLongestServing(data, year, n) {
        return data.congresses[year]
		 		.sort((x,y) => x[displayVar] < y[displayVar]);
	};

    $: users = getLongestServing(data, year, n);
    $: root = d3.pack().size([width - 2, height - 2])
                .padding(1)(d3.hierarchy({children: users})
                .sum(d => d[displayVar]));

    $: leaves = root.leaves();
    
    function toggleAnimation() {
        running = !running;
        if (running){
            interval = window.setInterval( function() {
                if (year === 2019)
                    year = 1790
                else 
                    year = year + 1;
                console.log(year)
            } , 500);
        }
        else {
            clearInterval(interval);
        }
    };

</script>

<p>The year is: {year}</p>

<!-- <button on:click={toggleAnimation}>Play/Pause</button> -->
<input type=range bind:value={year} min=1790 max=2019>

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

{#if isHovered}
    <WikipediaToolTip bind:x bind:y bind:message/>
{/if}
