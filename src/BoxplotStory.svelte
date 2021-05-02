<script>
  	import Boxplot2 from './Boxplot2.svelte';
    import { boxplotOutcomeVar } from './stores.js';
    import Scroller from '@sveltejs/svelte-scroller';
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
		switch (index) {
			case 0:
				boxplotOutcomeVar.set('cumulative_time_sen_and_house');
				break;
			case 2:
				boxplotOutcomeVar.set('cumulative_time_sen_and_house');
				break;
			case 3:
				boxplotOutcomeVar.set('age');
				break;
		}
	}
</script>

<Scroller
    {top}
    {threshold}
    {bottom}
    bind:count
    bind:index
    bind:offset
    bind:progress>
        <div slot="background">
            <h2>Congress Over The Years</h2>
            <Boxplot2 {data}/>		
        </div>

        <div slot="foreground">
            <section class="story-part"> Let's take a look at the distribution of experience in Congress over the years... </section>
                
            <section class="story-part"> Time spent in Congress was relatively flat up until WW2.</section>

            <section class="story-part">After WW2, members of Congress began to serve longer terms.</section>

            <section class="story-part">How about average age in Congress?</section>

            <section class="story-part">While age has gone up, this trend has largely tracked with life expectancy.</section>

            <section class="story-part">Adjusted for life expectancy, Congress is actually younger than it once was.</section>

            <section class="story-part">How do patterns vary by house and senate?</section>

        </div>

</Scroller>