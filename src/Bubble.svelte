<script>
    export let users;
</script>

<ul>
	{#each users as user}
		<li>
            {user.wikipedia}
		</li>
	{/each}
</ul>