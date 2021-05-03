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
        <section class="story-part">  Much of the experience is concentrated in a few long-serving politicians. 
            In this chart, each circle represents a member of Congress. The area of the circle corresponds to the number of years spent in Congress. 
            Hover over each circle to see who the circle represents. 
             </section>
            
        <section class="story-part"> Dissatisfaction with the "career politician" is a theme among populists on both sides of the aisle.  
         </section>

        <section class="story-part"> Are there more career politicians today than there were in the past?
            This visualization explores age and years of service of members of Congress have changed over time.
        </section>

        <section class="blank-story-part"></section>
    </div>
</Scroller>