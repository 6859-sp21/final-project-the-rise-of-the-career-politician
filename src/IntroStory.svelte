<script>
	import Scroller from '@sveltejs/svelte-scroller';
    import { winWidth, winHeight } from './stores.js';

    let count;
	let index;
	let offset;
	let progress;
	let top = 0.1;
	let threshold = 0.5;
	let bottom = 0.9;

    const width = .4*$winWidth;
    const height = .3*$winHeight;

</script>

<Scroller {index}>
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
        <section class="story-part"> Dissatisfaction with the "career politician" is a theme among populists on both sides of the aisle. 
            Whether it's "drain the swamp" or a no corporate PAC pledge, populist messages suggest the need for an outsider to disrupt the status quo and deliver for the American people.
        </section>

        <section class="story-part"> Are there more career politicians today than there were in the past? 
            This visualization seeks to answer this question by exploring the age and term lengths of members of Congress over time. 
            It concludes with some analysis of how these outcomes are related to polarization and ideology.
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
