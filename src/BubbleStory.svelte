<script>
	import Scroller from '@sveltejs/svelte-scroller';
	import BubbleChart from './BubbleChart.svelte';
    import { currentSection, startedScrolling, bubbleN, 
        bubbleShowAnnotation, bubbleShowAnnotation2 } from './stores.js'

    export let data;

    let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;

    let disableInterval = false;
    let i = 0;
    const yearsToLoop = [1850, 1916, 1940, 1988, 2021];
    let interval;

    
    $: {
        progress = progress;
        if ($startedScrolling) currentSection.set("bubbleplot");
    }


    bubbleN.subscribe(x => {
        if (!yearsToLoop.includes(x)){
            disableInterval = true;
            clearInterval(interval)
        }
    });

    $: {
		switch (index) {
			case 0:
                bubbleN.set(2021);
                bubbleShowAnnotation2.set(false);
                break;
            case 1:
                bubbleN.set(2021);
                clearInterval(interval);
                bubbleShowAnnotation.set(false);
                bubbleShowAnnotation2.set(true);
                break;
            case 2:
                bubbleShowAnnotation2.set(false);
                clearInterval(interval);
                if (! disableInterval) {
                    interval = setInterval(() => {
                            i = (i+1)%yearsToLoop.length;
                            bubbleN.set(yearsToLoop[i]);
                    }, 1000);
                }
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
        <!-- 0 --> <section class="story-part"> 
            This chart represents the distribution of experience in the current Congress. <i>Each circle represents a member of Congress</i>
        </section>
        <!-- 1 --> <section class="story-part">  The majority of the 535 members of Congress have little experience.
            A few members, the 
            <span class="emphasize"> career politicians</span>, have served 
            <span class="emphasize"> over 25 years.</span> 
         </section>
        
        <!-- 2 --> <section class="story-part"> <i>Is today's distribution an anomaly?</i> 
            
            <br><br>
            Compared to past Congresses, term lengths are longer. 
            Still, current Congress does not appear to have a greater concentration of career politicians. 
        </section>

        <!-- 3 --> <section class="story-part"> 
            <span class="direction"> 
                Explore for yourself. Move the slider to view different the experience distributions of historical Congresses.
            </span> 
        </section>        

        <section class="blank-story-part"></section>
    </div>
</Scroller>