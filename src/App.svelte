<script>
	import { onMount } from 'svelte';
	import BubbleChart from './BubbleChart.svelte';
	import Boxplot from './Boxplot.svelte';

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
</script>

<main>
	<h1>{name}</h1>
	{#await data}
		<p>...waiting</p>
	{:then data}
		<BubbleChart data={data}/>	
	{:catch error}
		<p>An error occurred!</p>
	{/await}
	
	<h1>Boxplot Over Time</h1>
	{#await data}
		<p>...waiting</p>
	{:then data}
		<Boxplot data={data}/>	
	{:catch error}
		<p>An error occurred!</p>
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