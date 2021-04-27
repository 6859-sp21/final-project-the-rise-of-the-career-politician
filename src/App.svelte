<script>
	import { onMount } from 'svelte';
	import Scroller from '@sveltejs/svelte-scroller';
	import BubbleChart from './BubbleChart.svelte';
	import Boxplot2 from './Boxplot2.svelte';
	import Scatterplot from './Scatterplot.svelte';
	import Scatterplot2 from './Scatterplot2.svelte';
	
	export let name;
	let data = Promise.all([
			d3.json('./data/all_congressmen.json'),
			d3.json('./data/congress_by_year.json'),
		])
		.then(d => {
			const congressmen = d[0]
			const congresses = d[1]
			return ({congressmen, congresses})
		})
	
	// Scroller stuff
	let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;
</script>

<main>
	<h1>{name}</h1>
	<h5>No Person shall be a Representative 
		who shall not have attained to the Age of twenty five Years
	- U.S. Constitution art. I, § 2, cl. 2</h5>

	{#await data}
		<p>...waiting</p>
	{:then data}
	<Scroller
		{top}
		{threshold}
		{bottom}
		bind:count
		bind:index
		bind:offset
		bind:progress
	>
		<div slot="background">
			<!-- <p>current section: <strong>{index + 1}/{count}</strong></p>
			<progress value="{count ? (index + 1) / count : 0}"></progress>

			<p>offset in current section</p>
			<progress value={offset || 0}></progress>

			<p>total progress</p>
			<progress value={progress || 0}></progress> -->
		</div>

		<div slot="foreground" style="padding: 0 0 0 50%;">
			<section>
				<h2>Congress Sized According to Years Spent in Congress</h2>
				<BubbleChart data={data}/>			
			</section>
			<section>
				<h2>Congress Over The Years</h2>
				<Boxplot2 {data}/>	
			</section>
			<section>
				<h2>Age versus Ideology</h2>
				<Scatterplot2 
				{data} 
				xVar={'nominate_dim1'}
				yVar={'nominate_dim2'}
				colorVar={'max_age'}
				sizeVar={'cumulative_time_sen_and_house'}/>
			</section>
			<section>section 4</section>
			<section>section 5</section>
		</div>
	</Scroller>	
	{:catch error}
		<p>An error occurred!</p>
		{console.log(error)}
	{/await}


</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>