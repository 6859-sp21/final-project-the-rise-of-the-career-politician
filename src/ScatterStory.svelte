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
                // scatterHighlighted.set(Array());
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
        <section class="story-part"> While members of Congress may be slightly older and serving longer, why does that matter? In this section, 
            we explore how longer terms correlate with different variables of interest.
            
            <br><br>
            Let's zoom in on Congress today. 
            This scatterplot shows the relationship between a member's ideology and length of tenure. Ideology scores are computed based on historical voting patterns 
            <a href="https://en.wikipedia.org/wiki/NOMINATE_(scaling_method)">using the DW-NOMINATE algorithm</a>. 
        </section>

        <!-- 1 -->
        <section class="story-part"> In general, the longest serving members of Congress tend to be more moderate. 
            This is especially true for conservatives, where
            <span class="red">time in Congress is negatively correlated with conservative ideology.</span>

            <br><br>Some very liberal members, like
            <span class="blue"> Rep. Maxine Waters and Rep. Barbara Lee</span>,  have had long tenures.
        </section>

        <!-- 2 -->
        <section class="story-part"> Let's explore some other outcomes... <i>Do more experienced members sponsor more bills?</i> 
            
            <br><br>There is not a clear relationship.  
        </section>

        <!-- 3 -->
        <section class="story-part"> <i>Do longer-tenured members work across the aisle more?</i> 
            
            <br><br> There's a small positive correlation between length of tenure and bipartisan bills sponsored. 
        </section>

        <!-- 4 -->
        <section class="story-part"> While these outcomes are crude and a lot of what's desired by members of Congress cannot be plotted on a graph, 
            it is not clear that more experienced members of Congress differ in behavior from newer members. 

            <br><br>
            <span class="direction">Try it yourself! Explore different variables and years of Congress.</span>
        </section>

        <section class="blank-story-part"></section>
    </div>
</Scroller>

<style>
    [slot="foreground"] {
		pointer-events: none;
	}
	
	[slot="foreground"] section {
		pointer-events: all;
	}
</style>