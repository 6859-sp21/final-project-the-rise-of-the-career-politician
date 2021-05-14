<script>
	import { onMount } from 'svelte';
	import BubbleStory from './BubbleStory.svelte';
	import BoxplotStory from './BoxplotStory.svelte';
	import ScatterStory from './ScatterStory.svelte';	
	import IntroStory from './IntroStory.svelte';
	import ProgressHeader from './ProgressHeader.svelte';
	import { currentSection } from './stores.js';
	import * as d3 from 'd3';
import ConclusionStory from './ConclusionStory.svelte';
	export let name;

	let data = Promise.all([
			d3.json('./data/all_congressmen.json'),
			d3.json('./data/congress_by_year.json'),
			d3.json('./data/report_cards/2020-report-card.json'),
			d3.json('./data/misconduct.json'), 
			d3.csv('./data/HSall_members.csv')
		])
		.then(d => {
			const congressmen = d[0]
			
			const ideologyScores = d[4].reduce(function(map, obj) {
				map[obj.bioguide_id] = obj;
				return map;
			}, {});

			// Integrate other datasets 
			const misconduct = d3.group(Object.values(d[3]), d => d.person)
			for (const id in congressmen){
				if (id in d[2]){
					congressmen[id]['report_card'] = d[2][id]
					for (const [key, value] of Object.entries(d[2][id]))
						congressmen[id][key] = value
				}
				const govtrack = congressmen[id]['govtrack']
				if (govtrack in d[3]){
					congressmen[id]['misconduct'] = misconduct.get(govtrack)
				}
				if (id in ideologyScores) {
					for (const [key, value] of Object.entries(ideologyScores[id]))
						congressmen[id][key] = value
				}
			}

			const congresses = d[1]
			for (let year = 1790; year < 2021; year++)
				congresses[year] = congresses[year].map(obj => ({...obj, ...ideologyScores[obj.id]}))
			
			congresses[2021] = congresses[2021].map(obj => ({...obj, ...d[2][obj.id]}))
			return ({congressmen, congresses})
		})
	
</script>
<main>
	<ProgressHeader/>
	<h1>{name}</h1>
	{#await data}
		<p>...waiting</p>
	{:then data}
		<div class="spacer" id="intro"></div>
		<IntroStory/> 

		<div class="spacer" id="bubbleplot">
			<h1>Distribution of Years in Congress</h1>
		</div>
		<BubbleStory {data}/>	

		<div class="spacer" id="boxplot">
			<h1>Congress Over The Years</h1>
		</div>
		
		<BoxplotStory {data}/>

		<div class="spacer" id="scatterplot">
			<h1>Congress Today</h1>
		</div>
		<ScatterStory {data}/>

		<div class="spacer" id="conclusion">
			<h1>Conclusion</h1>
		</div>
		<ConclusionStory/>
		<div class="footer">
            <h3>Data Sources:</h3>
            <ul>
                <li><a href="https://www.govtrack.us/congress/members">Govtrack Congressional Database</a></li>
                <li><a href="https://voteview.com/about">Voteview</a></li>
            </ul>
    
            <a href="https://github.com/6859-sp21/final-project-the-rise-of-the-career-politician">Project Writeup</a>    
        </div>

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
		/* background-color: rgba(87, 84, 84, 0.5); */
	}

	h1 {
		/* color: #ff3e00; */
		text-transform: uppercase;
		font-size: 3em;
		font-weight: 100;
	}

	.spacer h1 {
		margin: 5em 0 10em 0;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.spacer {
		height: 15%;
	}

	:global(.story-part) {
		/* height: 600px; */		
		width: 20%;
		position: relative;
		background-color: rgba(22, 117, 146, 0.5); 
		color: black;
		font-size: 1.5em;
		padding: 1em;
		margin: 0 0 50em 0;
		z-index: 4;
	}

	:global(.blank-story-part) {
		/* height: 600px; */		
		width: 20%;
		background-color: rgba(0, 0, 0, 0); 
		padding: 1em;
		margin: 0 0 0 0;
	}
	
	:global(.red) {
		color: red;
	}

	:global(.blue) {
		color: blue;
	}

	:global(.emphasize) {
		color: black;
		font-weight: bold;
		text-transform: uppercase;
	}

	:global(.direction) {
		color: black;
		font-weight: bold;
	}
	
    .footer { 
		text-align: left; 
		position: fixed;
        height: 20%;
		left: 85%;
		bottom: 0%;
        z-index: 5;
	}

	ul, li {
		list-style: none;
		text-align: left;
		margin: 0;
		padding: 0;
	}
</style>