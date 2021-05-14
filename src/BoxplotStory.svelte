<script>
  	import Boxplot2 from './Boxplot2.svelte';
    import { boxplotOutcomeVar, boxplotRepType, currentSection, 
        showLifeExpectancy, startedScrolling, boxplotShowAnnotation } from './stores.js';
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
                boxplotShowAnnotation.set(false);
				boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                showLifeExpectancy.set(false);
				break;
			case 2:
				boxplotOutcomeVar.set('age');
                showLifeExpectancy.set(true);
				break;
            case 3:
				boxplotOutcomeVar.set('age');
                showLifeExpectancy.set(true);
                boxplotRepType.set('both');
				break;
            case 4:
                showLifeExpectancy.set(true);
				boxplotOutcomeVar.set('min_age');
                boxplotRepType.set('both');
				break;
            case 5:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                showLifeExpectancy.set(true);
                boxplotRepType.set('both');
				break;

            case 7:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                boxplotRepType.set('sen');
                showLifeExpectancy.set(false);
                break;
            case 8:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                boxplotRepType.set('rep');
                showLifeExpectancy.set(false);
                break;
        }
	}

    $: {
        progress = progress;
        if ($startedScrolling) currentSection.set("boxplot");
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
                The following chart shows boxplots of the distribution of years in Congress by decade. </section>
                
            <!-- 1 --> <section class="story-part"> Time spent in Congress was relatively flat up until WW2.
                After WW2, members of Congress began to serve longer terms.</section>

            <!-- 2 --> <section class="story-part">How about average age in Congress?</section>

            <!-- 3 --> <section class="story-part">While age has gone up slightly, this trend has lagged behind gains in life expectancy. Congress does not seem to be getting much older.
                       </section>

            <!-- 4 --> <section class="story-part">Moreover, if we look at the age when first elected, members of Congress are not starting any earlier. 
                <span class="emphasize">So, what explains the increased term lengths?</span>
            </section>

            <!-- 5 --> <section class="story-part">Let's move back to term lengths and overlay life expectancy shifted by 30 years (the minimum age for a senator).
                Increases in term lengths are closely correlated with increases in life expectancy. 
                <span class="emphasize">Career politicians stay elected until they die.</span> 
            </section>


            <!-- 6 --> <section class="story-part">How do patterns vary by house and senate?</section>

            <!-- 7 --> <section class="story-part">In the senate, the median time in Congress increased from 1 term (6 years) to 2 terms (12 years) shortly after WW2. 
                
                While the average senator only serves 12 years today, 
                <span class="emphasize">25% of senators have served for 24 years. </span>
            </section>

            <!-- 8 --> <section class="story-part">The increases in time spent in the House have been more dramatic. The average House member serves 4 terms, with 25% serving 8 terms! 
                John Dingell, the House member with the longest tenure ever, spent 60 years as a representative from Michigan! 30 consecutive terms. </section>
            
            <!-- 9 --> <section class="blank-story-part"></section>
            
        </div>

</Scroller>