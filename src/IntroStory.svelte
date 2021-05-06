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

    const width = .4*$winWidth;
    const height = .3*$winHeight;


    $: {
        progress = progress;
        if ($startedScrolling) currentSection.set("intro");
    }
    document.addEventListener('scroll', () => {startedScrolling.set(true)});
    
</script>

<Scroller {index} bind:progress>
    <div slot="background">
        <ul>
            <li>
                <div class="img-wrap">
                    <img src={"images/drain_the_swamp.jpeg"} alt="drain the swamp" height={height}>
                </div>
            </li>
            <br>
            <li>
                <img src={"images/no_pac_money.webp"} alt="no pac money" height={height}/>
            </li>
        </ul>
    </div>
    
    <div slot="foreground" class="foreground">
        <section class="story-part"> Dissatisfaction with business-as-usual in American politics is a theme among populists on both sides of the aisle. 
            Whether it's "drain the swamp" or a no corporate PAC pledge, populist messages suggest the need for an outsider to disrupt 
            the status quo and deliver for the American people. 
        </section>

        <section class="story-part"> Many criticisms take aim at the establishment or the professional politicians who have been in office for decades. 
            Term  limits. 
        </section>

        <section class="story-part"> Are there really more career politicians today than there were in the past? Continue scrolling to find out. 
            This article explores the age and term lengths of members of Congress over time. 
            It concludes with a visual analysis of how these outcomes may be related to polarization and ideology.
        </section>

        <section class="blank-story-part"></section>

    </div>
</Scroller>

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }
</style>
