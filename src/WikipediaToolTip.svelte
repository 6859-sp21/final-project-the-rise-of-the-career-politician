<script>
	import { md5 } from './md5.js';

	export let message;
	export let x; 
	export let y;
	export let otherFields = false;
	let image; 
	let data = message.detail.data.data;
	let showMore = false

	let name = data.official_full;
    if (name === undefined || name === "unknown") name = data.wikipedia;

	function getWikiPhoto() {
		// https://stackoverflow.com/questions/34393884/how-to-get-image-url-property-from-wikidata-item-by-api
		const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims` + 
            `&property=P18&entity=${data.wikidata}&format=json&origin=*`
        let promise = fetch(url)
			.then(response => response.json())
			.then(data => {
				const pictureName = data.claims.P18[0].mainsnak.datavalue.value
											.replaceAll(' ', '_');
				const md5sum = md5(pictureName);
				const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${md5sum[0]}/${md5sum.slice(0,2)}/${pictureName}`
				return imageUrl
			})
        return promise;
    }
	image = getWikiPhoto();

	const formattedLabels = [
        ['nominate_dim1', 'Ideology Score'],
        // ['nominate_dim2', 'Ideology Score ("hot topics" dimension)'],
        ['min_age', 'Age on Entering Congress'],
        // ['max_age', 'Max Age in Congress'],
        // ['age', 'Current Age'],
        // ['cumulative_time_sen_and_house', 'Total Time in Congress'],
        // ["cosponsored", '# of Bills Cosponsored'],
        ["bills_introduced", '# of Bills Introduced'],
        //["bills-reported", '# of Bills Gone Out of Committee'],
        ['bills_enacted_ti', '# of Bills that Became Law'],
        // ["leadership", 'Leadership Score'],
        ["missed_votes", "% of Votes Missed"],
        // ["bills-with-committee-leaders", "# of Bills with Committee Chair Cosponsors"],
        // ["bills-with-cosponsor-other-party", "# of Bipartisan Bills"],
        ["committee_positions", '# of Committee Positions']
	]
</script>

<div style="top: {y}px; left: {x}px;" class="tooltip">
	{#await image}
		<p>Loading image</p>
	{:then image}
		<img src={image} alt="image of {name}" width="100" height="100"/>
	{:catch error}
		{console.log(error)}
	{/await}
	<h4>{name}</h4>
	<ul>
		<li><strong>Year:</strong> {data.year}</li>
		<li><strong>Current Age:</strong> {data.age}</li>
		<li><strong>Total Time Served:</strong> {data.cumulative_time_sen_and_house}</li>
		<li><strong>Party:</strong> {data.party}</li>
		<li><strong>Position:</strong> {data.type === "sen" ? "Senator" : "Representative"}</li>
		<li><strong>State:</strong> {data.state}</li>
		{#if otherFields}
			{#each formattedLabels as o}
			{#if data[o[0]] !== undefined}
				{#if o === "nominate_dim1"}
					<li><strong>{o[1]}:</strong> {Math.round(data[o[0]] * 100) / 100}</li>
				{:else}
					<li><strong>{o[1]}:</strong> {data[o[0]]}</li>
				{/if}
			{/if}
			{/each}
		{/if}
	</ul>
</div>

<style>
    .tooltip {
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 2px;
		padding: 2px;
		position: absolute;
		color: black;
	}

	ul {
		float: left;
		text-align: left;
		list-style: none;
	}
</style>