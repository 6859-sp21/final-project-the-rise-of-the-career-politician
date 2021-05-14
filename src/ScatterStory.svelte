<script>
    import Scatterplot2 from './Scatterplot2.svelte';
    import Scroller from '@sveltejs/svelte-scroller';
    import { currentSection, startedScrolling, scatterShowAnnotation,
             scatterHighlighted, scatterPlotXVar, scatterShowOptions} from './stores.js';
    import { onMount } from 'svelte';

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
        progress = progress;
        if ($startedScrolling) currentSection.set("scatterplot");
    }
    
    $: {
		switch (index) {
            case 1:
                scatterShowAnnotation.set(false);
                scatterHighlighted.set(Array("Maxine Waters", "Barbara Lee"));
                break;
            case 2:
                scatterHighlighted.set(Array());
                scatterPlotXVar.set('cosponsored');
                break;
            case 3:
                scatterPlotXVar.set('bills_with_cosponsor_other_party');
                break;
            case 4: 
                scatterPlotXVar.set('nominate_dim1');
                scatterShowOptions.set(true);
                break;
        }
	}
</script>

<Scroller bind:index bind:progress>
    <div slot="background">
        <Scatterplot2 {data}/>	
    </div>

    <div slot="foreground">
        <!-- 0 -->
        <section class="story-part"> Let's focus in on Congress today... How does the increase in tenure correlate with outcomes?

            This scatterplot shows the relationship between a member's ideology and length of tenure. Ideology scores are computed based on historical voting patterns 
            <a href="https://en.wikipedia.org/wiki/NOMINATE_(scaling_method)">using the DW-NOMINATE algorithm</a>. 
        </section>

        <!-- 1 -->
        <section class="story-part"> In general, the longest serving members of Congress tend to be more moderate. 
            <span class="red"> This is especially true for conservatives, where term length is negatively correlated with right-wingness</span>
            
            <span class="blue">Some very liberal members, like Rep. Maxine Waters and Rep. Barbara Lee, have had long tenures.</span>
        </section>

        <!-- 2 -->
        <section class="story-part"> Let's explore some other outcomes... <i>Do longer-tenured members sponsor more bills?</i> There does not appear to be any relationship.  
        </section>

        <!-- 3 -->
        <section class="story-part"> <i>Do longer-tenured members work across the aisle more?</i> There's a small positive correlation between length of tenure and bipartisan bills sponsored. 
        </section>

        <!-- 4 -->
        <section class="story-part"> While these outcomes are crude, it is not obvious that longer tenured members of Congress differ in behavior from newer members. 

            <span class="direction">Try it yourself! Explore different variables and years of Congress.</span>
        </section>

        <section class="blank-story-part"></section>
    </div>
</Scroller>
