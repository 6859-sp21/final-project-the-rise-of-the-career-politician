<script>
	import { md5 } from './md5.js';

	export let message;
	export let x; 
	export let y;
	console.log(message);
	let image; 
	let data = message.detail.data.data;
	console.log(data);

	function getWikiPhoto() {
		// https://stackoverflow.com/questions/34393884/how-to-get-image-url-property-from-wikidata-item-by-api

		console.log('running get wiki photo')
		const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims` + 
            `&property=P18&entity=${data.wikidata}&format=json&origin=*`
        let promise = fetch(url)
			.then(response => response.json())
			.then(data => {
				const pictureName = data.claims.P18[0].mainsnak.datavalue.value
											.replaceAll(' ', '_');
				const md5sum = md5(pictureName);
				// console.log('picture name', pictureName, 'md5', md5sum)
				const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${md5sum[0]}/${md5sum.slice(0,2)}/${pictureName}`
				// console.log(imageUrl)
				return imageUrl
			})
        return promise;
    }
	image = getWikiPhoto();
</script>

<div style="top: {y}px; left: {x}px;" class="tooltip">
	{#await image}
		<p>Loading image</p>
	{:then image}
		<img src={image} alt="here" width="100" height="100"/>
		<h4>{data.official_full}</h4>
		<ul>
			<li>Age: {data.age}</li>
			<li>Cumulative Time in Office: {data.time_sen_and_house}</li>
			<li>Party: {data.party}</li>
			<li>Position: {data.type === "sen" ? "Senator" : "Representative"}</li>
			<li>State: {data.state}</li>
		</ul>
	{:catch error}
		<p>An error occurred! {console.log(error)}</p>
	{/await}
</div>

<style>
    .tooltip {
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
	}
</style>