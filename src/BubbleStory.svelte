<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import BubbleChart from './BubbleChart.svelte';
    export let data;

    let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;
</script>

<Scroller {index}>
    <div slot="background">
        <h2>Congress Sized According to Years Spent in Congress</h2>
        <BubbleChart data={data}/>				
    </div>
    
    <div slot="foreground" class="foreground">
        <section class="story-part"> If we look at the current Congress, much of the experience in terms of years in Congress, is concentrated in a few politicians. </section>
            
        <section class="story-part"> Dissatisfaction with the "career politician" was part of the populist appeal of then-candidate Donald Trump.</section>

        <section class="story-part"> Politicians attempt to distance themselves from the "career politician" brand by refusing PAC money. </section>

        <section class="story-part">But is there really a recent uptick in career politicians?</section>
    </div>
</Scroller>