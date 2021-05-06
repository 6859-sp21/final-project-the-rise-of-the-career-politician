<script>
	import * as d3 from 'd3';
    import { legendSize, legendColor } from 'd3-svg-legend';
	
	export let scale;
	export let title;
	export let xCircle;
	export let yCircle;

	let spacing = 15;

	let values;
	let quantiles = [.1, .5, .9];
	let totalLength;
	$: {
		values = quantiles.map(d => d3.quantile(scale.ticks(), d))
						  .map(d => Math.round(d))

		totalLength = values.map(d => scale(d) + spacing)
							.reduce((a,b) => a + b, 0) - spacing
	}
</script>

<g class='legend'>
	<text
	x = {xCircle + totalLength/2}
	y = {yCircle - 30}
	text-anchor="middle"
	font-size=13
	>{title}</text>

	{#each values as d, i}
		<circle
		 cx = {xCircle + scale(d) + spacing*i }
		 cy = {yCircle - scale(d)} 
		 r = {scale(d)}
		 fill = none
		 stroke = black
		/>

		<text
		x = {xCircle + scale(d) + spacing*i }
		y = {yCircle + 10} 
		text-anchor="middle"
		font-size={10}
		>{d}</text>
	{/each}
</g>