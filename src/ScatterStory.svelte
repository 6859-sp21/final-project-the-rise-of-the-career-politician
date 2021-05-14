<script>
    import Scatterplot2 from './Scatterplot2.svelte';
    import Scroller from '@sveltejs/svelte-scroller';
    import { currentSection, startedScrolling, scatterShowAnnotation } from './stores.js';
    import { onMount } from 'svelte';

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
        if ($startedScrolling) currentSection.set("scatterplot");
    }
    
    $: {
		switch (index) {
            case 1:
                scatterShowAnnotation.set(false);
                break;  
        }
	}
</script>

<Scroller bind:index bind:progress>
    <div slot="background">
        <Scatterplot2 {data}/>	
    </div>

    <div slot="foreground">
        <section class="story-part"> Let's focus in on Congress today... How does the increase in tenure correlate with outcomes?

            This scatterplot shows the relationship between a member's ideology and length of tenure. Ideology scores are computed based on historical voting patterns 
            <a href="https://en.wikipedia.org/wiki/NOMINATE_(scaling_method)">using the DW-NOMINATE algorithm</a>. 
        </section>
            
        <section class="story-part"> In general, the longest serving members of Congress tend to be more moderate. 
            <span class="red"> This is especially true for conservatives, where term length is negatively correlated with right-wingness</span>
            
            <span class="blue">Some very liberal members, like Rep. Maxine Waters and Rep. Barbara Lee, have had long tenures.</span>
        </section>

        <section class="blank-story-part"></section>
    </div>
</Scroller>
