<script>
    import { currentSection } from './stores.js';

    let sections = Array(
        ['intro', 'Introduction'],
        ['bubbleplot', 'Distribution of Congressional Experience'],
        ['boxplot', 'Congress over Time'],
        ['scatterplot', 'Congress Today'],
        ['conclusion', 'Conclusion']
    );
</script>

<header>
    <h2>Quick Navigation</h2>
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
		padding: 1em; 
		text-align: left; 
		margin-bottom: 1em;
		position: fixed;
		left: 85%;
		top: 0;
        font-size: 1em;
        z-index: 5;
	}

ul, li {
    list-style: none;
    text-align: left;
    margin: 0;
    padding: 0;
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