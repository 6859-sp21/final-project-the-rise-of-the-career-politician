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
                boxplotRepType.set('both');
				break;
            // case 4:
            //     showLifeExpectancy.set(true);
			// 	boxplotOutcomeVar.set('min_age');
            //     boxplotRepType.set('both');
			// 	break;
            case 3:
                boxplotOutcomeVar.set('cumulative_time_sen_and_house');
                showLifeExpectancy.set(true);
                boxplotRepType.set('both');
				break;

            // case 7:
            //     boxplotOutcomeVar.set('cumulative_time_sen_and_house');
            //     boxplotRepType.set('sen');
            //     showLifeExpectancy.set(false);
            //     break;
            // case 8:
            //     boxplotOutcomeVar.set('cumulative_time_sen_and_house');
            //     boxplotRepType.set('rep');
            //     showLifeExpectancy.set(false);
            //     break;
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
            <!-- 0 --> <section class="story-part"> Let's take a more precise look at the distribution of experience in Congress by decade... 
            </section>
                
            <!-- 1 --> <section class="story-part"> Time spent in Congress was relatively flat up until WW2.
                <span class="emphasize">
                    After WW2, members of Congress began to serve longer terms.
                </span>
                <br><br>
                Notably, some members began to serve <strong>really</strong> long terms.
            </section>

            <!-- 2 --> <section class="story-part"><i>How about average age in Congress?</i>

                While average age has gone up slightly, this trend has lagged behind gains in life expectancy. 
                <br><br>
                <span class="emphasize">
                    Current Congress is the oldest Congress ever, but Congress has always been old.
                </span>
                       </section>

            <!-- na --> 
            <!-- <section class="story-part">If we look at the age when first elected, members of Congress are joining at the same age. 
                <span class="emphasize">What explains the longer tenures?</span>
            </section> -->

            <!-- 4 --> 
            <section class="story-part">Let's look back at time in Congress and overlay life expectancy increases. 
                We see that term lengths for the outliers increased as life expectancy increased.

                <br><br>
                <span class="emphasize">Career politicians stay in Congress as long as they are alive.</span> 
            </section>
            
            <!-- 5 --> 
            <section class="story-part">
                <span class="direction">Explore the trends for yourself. How do increases in tenure differ between the House and Senate?</span>
            </section>


            <!-- 6 --> 
            <!-- <section class="story-part">How do patterns vary by house and senate?</section> -->

            <!-- 7 --> 
            <!-- <section class="story-part">In the senate, the median time in Congress increased from 1 term (6 years) to 2 terms (12 years) shortly after WW2. 
                
                While the average senator only serves 12 years today, 
                <span class="emphasize">25% of senators have served for 24 years. </span>
            </section> -->

            <!-- 8 --> 
            <!-- <section class="story-part">The increases in time spent in the House have been more dramatic. The average House member serves 4 terms, with 25% serving 8 terms! 
                John Dingell, the House member with the longest tenure ever, spent 60 years as a representative from Michigan! 30 consecutive terms. </section>
             -->

            <!-- 9 --> <section class="blank-story-part"></section>
            
            
        </div>

</Scroller>