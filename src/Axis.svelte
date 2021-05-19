<script>
	import * as d3 from 'd3';
	import { axisBottom, axisLeft } from 'd3-axis';

	export let width;
	export let height;
	export let margin;
	export let position;
	export let scale;

	let transform;
	let g;

	$: {
		d3.select(g).selectAll('*').remove();

		let axis;
		switch(position) {
			case 'bottom':
				axis = axisBottom(scale).tickSizeOuter(0);
				transform = `translate(0, ${height - margin})`;
				break;
			case 'bottom-date':
                axis = axisBottom(scale).tickSizeOuter(0).tickFormat(d3.format("d"));
				transform = `translate(0, ${height - margin})`;
				break;
			case 'left':
				axis = axisLeft(scale).tickSizeOuter(0);
				transform = `translate(${margin}, 0)`;
            
		}

		d3.select(g).call(axis);
	}
</script>

<g class='axis' bind:this={g} {transform} />
