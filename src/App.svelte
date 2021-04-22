<script>
	import { onMount } from 'svelte';
	import Bubble from './Bubble.svelte';

	export let name;
	let users = [];
	let year = 2019;
	let n = 20;
	let data = Promise.all([
			d3.json('./data/all_congressmen.json'),
			d3.json('./data/congress_by_year.json'),
		])
		.then(d => {
			const congressmen = d[0]
			const congresses = d[1]
			return ({congressmen, congresses})
		});

	function getLongestServing(data, year, n) {
		return data.congresses[year]
		 		.sort((x,y) => x['time_sen_and_house'] < y['time_sen_and_house'])
		 		.slice(0, n)
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href='https://svelte.dev/tutorial'>Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<input type=number bind:value={n} min=10 max=30>
	{#await data}
		<p>...waiting</p>
	{:then data}
		<Bubble users={getLongestServing(data, 2019, n)}/>	
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