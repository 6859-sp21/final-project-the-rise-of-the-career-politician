<script>
	import Scroller from '@sveltejs/svelte-scroller';
    import { winWidth, winHeight, currentSection, startedScrolling } from './stores.js';

    let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;


    $: {
        progress = progress;
        if ($startedScrolling) currentSection.set("conclusion");
    }

    const width = .6*$winWidth;
    const height = .3*$winHeight;    
</script>

<Scroller {index} bind:progress>
    <div slot="background">
        <br>
        <img src={"images/keeps_running.jpg"} alt="drain the swamp" height={2*height}>
    </div>
    
    <div slot="foreground" class="foreground">
        <section class="story-part"> 
            <p>
                <i>Are increasingly long tenures a problem?</i>
            </p> 
        </section>


        <section class="story-part"> 
            <p>
                Maybe. The Constitution was not written with 21st century life expectancies in mind. It has age minimums, but no age maximums... 
                If we have members of Congress serving lifelong terms, like Supreme Court justices, this could be a problem.
            </p> 
        </section>

        <section class="story-part"> 
            <p>
                On the other hand, these members have to win a Democratic election regularly. If their constituents are happy, does it matter? 
                Moreover, these members are generally more moderate. Term limits could increase polarization, which could mean even less bipartisan legislation.
            </p> 
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
