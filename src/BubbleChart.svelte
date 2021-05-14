<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { winWidth, winHeight, bubbleN, bubbleShowAnnotation } from './stores.js';
    import * as d3 from 'd3';
    import {annotation, annotationCalloutElbow} from 'd3-svg-annotation'
    import BubbleLegend from './BubbleLegend.svelte';
    import Bubble from './Bubble.svelte';
    import WikipediaToolTip from './WikipediaToolTip.svelte';
    export let data;

    let isHovered = false;
    let showAnnotation = true;
    let message;
    let mySvg;
    let x;
    let y;

    function mouseOver(event) {
        bubbleShowAnnotation.set(false);
        message = event;
        isHovered = true;
        x = event.detail.event.clientX;
		y = event.detail.event.clientY;
    }

    function mouseMove(event) {
        x = event.detail.event.clientX;
		y = event.detail.event.clientY;
	}

    function mouseOut(){
        isHovered = false;
    }

    let n = 50;
    let year = 2021;
    let running = false;
    let displayVar = 'cumulative_time_sen_and_house';
    let interval;
    const width = .6*$winWidth;
    const height = .7*$winHeight;

    function getLongestServing(data, year, n) {
        return data.congresses[year]
		 		.sort((x,y) => x[displayVar] < y[displayVar] ? 1: -1);
	};

    $: users = getLongestServing(data, $bubbleN, n);
    $: root = d3.pack().size([width - 2, height - 2])
                .padding(1)(d3.hierarchy({children: users})
                .sum(d => d[displayVar]).sort());

    $: leaves = root.leaves();

    function addAnnotation() {
        let bernie = leaves.find(x => x.data.official_full === "Bernard Sanders");
        const annotations = [{
            note: {label: "This bubble represents Senator Bernie Sanders. Hover for more information",
            bgPadding: 10},
            x: bernie.x,
            y: bernie.y,
            className: "show-bg",
            dy: 0,
            dx: width/3,
            color: "black",
            type: annotationCalloutElbow,
            connector: {end: "arrow", endscale: 10},
            subject: {
                radius: bernie.r + 10,
                radiusPadding: 10
            },
        }]

        const makeAnnotations = annotation()
            .notePadding(15)
            .annotations(annotations)

        d3.select(mySvg)
            .append("g")
            .attr("class", "annotation-group")
            .style("background-color", "rgba(230, 242, 255, 0.8)")
            .style("border-radius", "5px")
            .call(makeAnnotations)
    }

    onMount(() => addAnnotation());
    $: { //Once someone has hovered 
        if (! $bubbleShowAnnotation) {
            setTimeout(function() {
                d3.select(mySvg)
                    .selectAll(".annotation-group")
                    .transition().duration(4000)
                    .style('fill-opacity', 0)
                    .style('stroke-opacity', 0)
                    .remove()
            }, 100);
        }
    }
    
</script>

<h3>Distribution of experience in {$bubbleN}</h3>
<input type=range bind:value={$bubbleN} min=1790 max=2021>

<div>
    <svg bind:this={mySvg} width={width} height={height} transition:fade>
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