<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import BubbleChart from './BubbleChart.svelte';
    import { currentSection, startedScrolling, bubbleN } from './stores.js'

    export let data;

    let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;
    
    $: {
        progress = progress;
        if ($startedScrolling) currentSection.set("bubbleplot");
    }
    let i = 0;
    const yearsToLoop = [1812, 1860, 1919, 1940, 1970, 2003, 2021];
    let interval;
    $: {
		switch (index) {
			case 0:
                bubbleN.set(2021);
				break;
            case 1:
                bubbleN.set(2021);
                clearInterval(interval);
                break;
            case 2:
                // interval = setInterval(function() {
                //     i = (i+1)%yearsToLoop.length;
                //     bubbleN.set(yearsToLoop[i]);
                //     console.log('setting bubble to ', $bubbleN)
                // }, 500000);
				break;
        }
	}
</script>

<Scroller bind:index bind:progress>
    <div slot="background">
        <h2>Congress Sized According to Years Spent in Congress</h2>
        <BubbleChart data={data}/>				
    </div>
    
    <div slot="foreground" class="foreground">
        <!-- 0 --> <section class="story-part"> This chart represents the distribution of experience in the current Congress. 
            Each circle represents a member of the current Congress. 
            The area of the circle corresponds to the number of years spent in Congress, which is also shown in text. 
            Democrats are in blue, Republicans in red, and other party members in green.
            Try hovering over a circle to see who it represents. 
        </section>
       
        <!-- 1 --> <section class="story-part">  The majority of the 535 members of Congress have little experience. 
            A few members, who might be called <strong>career politicians</strong>, have served over 25 years. 
         </section>
        
        <!-- 2 --> <section class="story-part">  Is today's distribution really an anomaly? 
            Try moving the year slider to find out. 
        </section>        
        <!-- 4 <section class="story-part"> Try moving the slider to check out earlier Congresses. Do we really have more career politicians today than we had in the past?  -->
        <!-- </section> -->

        <section class="blank-story-part"></section>
    </div>
</Scroller>