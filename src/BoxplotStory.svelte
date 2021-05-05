<script>
  	import Boxplot2 from './Boxplot2.svelte';
    import { boxplotOutcomeVar, boxplotRepType, currentSection } from './stores.js';
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
			case 1:
				boxplotOutcomeVar.set('cumulative_time_sen_and_house');
				break;
			case 2:
				boxplotOutcomeVar.set('age');
				break;
            case 3:
				boxplotOutcomeVar.set('age');
                boxplotRepType.set('both');
				break;
            case 5:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                boxplotRepType.set('sen');
                break;
            case 6:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                boxplotRepType.set('rep');
                break;

        }
	}

    $: {
        progress = progress;
        currentSection.set("boxplot");
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
            <Boxplot2 {data}/>		
        </div>

        <div slot="foreground">
            <!-- 0 --> <section class="story-part"> Let's take a look at the distribution of experience in Congress over the years... 
                The following chart shows boxplots of the distribution of years in Congress by decade. Hover over outliers to see the longest serving members. 
                Hover over each boxplot to see summary statistics.</section>
                
            <!-- 1 --> <section class="story-part"> Time spent in Congress was relatively flat up until WW2.
                After WW2, members of Congress began to serve longer terms.</section>

            <!-- 2 --> <section class="story-part">How about average age in Congress?</section>

            <!-- 3 --> <section class="story-part">While age has gone up, this trend has largely tracked with life expectancy. 
                [TODO] add life expectancy data to make claim about changes relative to that.</section>

            <!-- 4 --> <section class="story-part">How do patterns vary by house and senate?</section>

            <!-- 5 --> <section class="story-part">In the senate, the median time in Congress increased from 6 years to 12 following WW2. 
                
                While the median number of terms has only increased by 1 term, the interquartile range has increased considerably. 
                25% of senators have served for 24 years. </section>

            <!-- 6 --> <section class="story-part">The increases in time spent in the House have been more dramatic. The average House member serves 4 terms. 
                John Dingell, the House member with the longest tenure ever, spent 60 years as a representative from Michigan! 30 consecutive terms. </section>
            
            <!-- 7 --> <section class="blank-story-part"></section>
            
        </div>

</Scroller>