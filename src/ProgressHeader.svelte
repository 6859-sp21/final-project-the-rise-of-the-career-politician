<script>
    import { currentSection } from './stores.js';

    let sections = Array(
        ['intro', 'Introduction'],
        ['bubbleplot', 'Bubble Plot'],
        ['boxplot', 'Congress over the Years'],
        ['scatterplot', 'Congress Today']
    );
</script>

<header>
    <ul>
        {#each sections as s}
        <li class={$currentSection === s[0]? "current" : "inactive"}>
            <a href={'#'+s[0]}>{s[1]}</a>
        </li>
        {/each}
    </ul>
</header>

<style>

header { 
		/* background-color: yellow;  */
		padding: 2em; 
		text-align: left; 
		margin-bottom: 1em; 
		position: fixed;
		left: 88%;
		top: 0;
	}

li {
    list-style: none;
    text-align: left;
}

.inactive {
    color:rgba(0, 0, 0, 0.26);
}

.current {
    color: black;
}

a {
  color: inherit; /* blue colors for links too */
  text-decoration: inherit; /* no underline */
}

</style>