<script>
	export let message;
	export let x; 
	export let y;
	console.log(message);
	let image = message.detail.image; 
	let data = message.detail.data.data;
	console.log(data);
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
		<p>An error occurred!</p>
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