<script>
    import Scatterplot2 from './Scatterplot2.svelte';
    import Scroller from '@sveltejs/svelte-scroller';
    import { currentSection } from './stores.js';
    export let data;
    
	// Scroller stuff
	let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;

    $: {
        progress = progress;
        currentSection.set("Bubble Chart");
    }
</script>

<Scroller bind:progress>
    <div slot="background">
        <h2>Age versus Ideology</h2>
        <Scatterplot2 {data}/>	
    </div>

    <div slot="foreground">
        <section class="story-part"> How does experience in Congress correlate with outcomes like ideology? </section>
            
        <section class="story-part"> In general, the longest serving members of congress tend to be more moderate. There are some exceptions,
            such as Rep. Maxine Waters on the left and Rep. James Sensenbrenner on the right.
        </section>

        <section class="blank-story-part"></section>
    </div>
</Scroller>
