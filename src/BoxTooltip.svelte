<script>
	export let messageBox;
	export let xToolBox; 
	export let yToolBox;
	export let label;
	let data = messageBox.detail.data;
</script>

<div style="top: {yToolBox}px; left: {xToolBox}px;" class="tooltip">
	<h4>Summary of {label}</h4>
	<h4>{data.x0} - {data.x1}</h4>
    <ul>
		<li>Min: {data.absRange[0]}</li>
		<li>25%: {data.quartiles[0]}</li>
		<li>50%: {data.quartiles[1]}</li>
		<li>75%: {data.quartiles[2]}</li>
        <li>Max: {data.absRange[1]}</li>
	</ul>
</div>

<style>
    .tooltip {
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
		color: black;
	}
</style>
