<script>
    import Scatterplot2 from './Scatterplot2.svelte';
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
</script>

<Scroller>
    <div slot="background">
        <h2>Age versus Ideology</h2>
        <Scatterplot2 
        {data} 
        xVar={'nominate_dim1'}
        yVar={'cumulative_time_sen_and_house'}
        colorVar={'max_age'}
        sizeVar={'cumulative_time_sen_and_house'}/>	
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
