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
				break;
            case 1:
                bubbleN.set(2021);
                clearInterval(interval);
                break;
            case 2:
                clearInterval(interval);
                if (! disableInterval) {
                    console.log('launching interval')
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
            <span class="emphasize"> career politicians</span>, have served over 25 years. 
         </section>
        
        <!-- 2 --> <section class="story-part">  Is today's distribution really an anomaly? Compared to past congresses, while term lengths are longer, 
            the current Congress does not appear to have a greater concentration of career politicians. 
        </section>

        <!-- 3 --> <section class="story-part"> Explore for yourself. Move the slider to view different Congresses experience distributions. 
        </section>        

        <section class="blank-story-part"></section>
    </div>
</Scroller>