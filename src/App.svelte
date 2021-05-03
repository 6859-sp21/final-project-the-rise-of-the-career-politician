<script>
	import { onMount } from 'svelte';
	import BubbleStory from './BubbleStory.svelte';
	import BoxplotStory from './BoxplotStory.svelte';
	import ScatterStory from './ScatterStory.svelte';	
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
	<h2>Exploring how Congress has changed over time</h2>
	<!-- <h5>No Person shall be a Representative 
		who shall not have attained to the Age of twenty five Years
	- U.S. Constitution art. I, § 2, cl. 2</h5> -->
	<div class="spacer"></div>
	{#await data}
		<p>...waiting</p>
	{:then data}
	<div class="space"></div>
		<BubbleStory {data}/>	

		<div class="spacer"></div>
		<BoxplotStory {data}/>

		<div class="spacer"></div>
		<ScatterStory {data}/>

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
		background-color: rgba(0,0,0,0.5);
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

	.spacer {
		height: 25%;
	}

	:global(.story-part) {
		/* height: 600px; */		
		width: 30%;
		background-color: rgba(22, 117, 146, 0.5); 
		color: white;
		size: 4em;
		padding: 1em;
		margin: 0 0 50em 0;
	}

	:global(.blank-story-part) {
		/* height: 600px; */		
		width: 20%;
		background-color: rgba(0, 0, 0, 0); 
		padding: 1em;
		margin: 0 0 50em 0;
	}
</style>