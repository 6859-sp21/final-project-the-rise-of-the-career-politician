<script>
    import { onMount } from 'svelte';
import Bubble from './Bubble.svelte';
    export let data;

    let n = 30;
    let el;
    const width = 800;
    const height = 800;

    function getLongestServing(data, year, n) {
        console.log('changed n ', n)
		return data.congresses[year]
		 		.sort((x,y) => x['time_sen_and_house'] < y['time_sen_and_house'])
		 		.slice(0, n);
	};

    $: users = getLongestServing(data, 2019, n);
    $: root = d3.pack().size([width - 2, height - 2])
                .padding(3)(d3.hierarchy({children: users})
                .sum(d => d.time_sen_and_house));

    $: leaves = root.leaves();
</script>

<input type=number bind:value={n} min=10 max=80>
<div>
    <svg width={width} height={height}>
        {#each leaves as d}
            <Bubble d={d}/>
        {/each}
    </svg>
</div>