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
	<div class="spacer"></div>
	{#await data}
		<p>...waiting</p>
	{:then data}
		<Scroller {offset}>
			<div slot="background">
				<h2>Congress Sized According to Years Spent in Congress</h2>
				<BubbleChart data={data}/>				
			</div>
			
			<div slot="foreground" class="foreground">
				<section class="story-part"> If we look at the current Congress, much of the experience in terms of years in Congress, is concentrated in a few politicians. </section>
					
				<section class="story-part"> Dissatisfaction with the "career politician" was part of the populist appeal of then-candidate Donald Trump.</section>

				<section class="story-part"> Politicians attempt to distance themselves from the "career politician" brand by refusing PAC money. </section>

				<section class="story-part">But is there really a recent uptick in career politicians?</section>
			</div>
		</Scroller>
		<div class="spacer"></div>

		<Scroller>
			<div slot="background">
				<h2>Congress Over The Years</h2>
				<Boxplot2 {data}/>		
			</div>

			<div slot="foreground">
				<section class="story-part"> Let's take a look at the distribution of experience in Congress over the years... </section>
					
				<section class="story-part"> Time spent in Congress was relatively flat up until WW2.</section>

				<section class="story-part">After WW2, members of Congress began to serve longer terms.</section>

				<section class="story-part">How about average age in Congress?</section>

				<section class="story-part">While age has gone up, this trend has largely tracked with life expectancy.</section>

			</div>

		</Scroller>
		<div class="spacer"></div>
		<Scroller>
			<div slot="background">
				<h2>Age versus Ideology</h2>
				<Scatterplot2 
				{data} 
				xVar={'nominate_dim1'}
				yVar={'cumulative_time_sen_and_house'}
				colorVar={'max_age'}
				sizeVar={'cumulative_time_sen_and_house'}/>	
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
		height: 50%;
	}

	.story-part {
		/* height: 600px; */		
		width: 20%;
		background-color: rgba(22, 117, 146, 0.5); 
		color: white;
		padding: 1em;
		margin: 0 0 50em 0;
	}
</style>