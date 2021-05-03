<script>
  	import Boxplot2 from './Boxplot2.svelte';
    import { boxplotOutcomeVar, boxplotRepType} from './stores.js';
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
            case 5:
				boxplotOutcomeVar.set('age');
                boxplotRepType.set('both');
				break;
            case 7:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                boxplotRepType.set('sen');
                break;
            case 9:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                boxplotRepType.set('rep');
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
            <section class="story-part"> Let's take a look at the distribution of experience in Congress over the years... 
                The following chart shows boxplots of the distribution of years in Congress by decade. Hover over outliers to see the longest serving members.</section>
                
            <section class="story-part"> Time spent in Congress was relatively flat up until WW2.</section>

            <section class="story-part">After WW2, members of Congress began to serve longer terms.</section>

            <!-- 3 --> <section class="story-part">How about average age in Congress?</section>

            <!-- 4 --> <section class="story-part">While age has gone up, this trend has largely tracked with life expectancy.</section>

            <!-- 5 --> <section class="story-part">Adjusted for life expectancy, Congress is actually younger than it once was.</section>

            <!-- 6 --> <section class="story-part">How do patterns vary by house and senate?</section>

            <!-- 7 --> <section class="story-part">In the senate, the median time in Congress increased from 6 years to 12 following WW2.</section>

            <!-- 8 --> <section class="story-part">While the median number of terms has only increased by 1 term, the interquartile range has increased considerably. 
                25% of senators have served for 24 years. </section>

            <!-- 9 --> <section class="story-part">The increases in time spent in the House have been more dramatic. 
                John Dingell, the House member with the longest tenure every, spent 60 years as a representative from Michigan. He served 30 consecutive terms starting at 28 years old. </section>
            
            <!-- 10 --> <section class="blank-story-part"></section>
            
        </div>

</Scroller>