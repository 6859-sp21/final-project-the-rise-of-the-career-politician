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
        <section class="story-part"> In this chart, each circle represents a member of the current Congress. The area of the circle corresponds to the number of years spent in Congress (also shown in text). 
            Democrats are in blue, Republicans in red, and independents in green. Try hovering over a circle to see who it represents. 
        </section>
       
        <section class="story-part">  The majority of the 535 members of Congress have little experience. A few members, the "career politicians", have served over 25 years. 
         </section>
        
         <section class="story-part"> Try moving the slider to check out earlier Congresses. Do we really have more career politicians today than we had in the past? 
        </section>

        <section class="blank-story-part"></section>
    </div>
</Scroller>