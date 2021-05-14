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

    const width = .6*$winWidth;
    const height = .3*$winHeight;


    $: {
        progress = progress;
        if ($startedScrolling) currentSection.set("intro");
    }
    document.addEventListener('scroll', () => {startedScrolling.set(true)});
    
</script>

<Scroller {index} bind:progress>
    <div slot="background">
        <ul class="blank">
            <li>
                <img src={"images/drain_the_swamp.jpeg"} alt="drain the swamp" height={height}>
            </li>
            <br>
            <li>
                <img src={"images/no_pac_money.webp"} alt="no pac money" height={height}/>
            </li>
        </ul>
    </div>
    
    <div slot="foreground" class="foreground">
        <section class="story-part"> 
            <p>
                Dissatisfaction with current American politics is a populist theme on both sides of the aisle. 
                Whether it's 
                <span class="red">drain the swamp</span> 
                or a 
                <span class="blue">no corporate PAC pledge</span>,
                
                populist messages suggest the need for an outsider to disrupt 
                the status quo.

            </p> 
        </section>

        <section class="story-part">
            <p>
                Many criticisms take aim at the corruption of the  
                <span class="emphasize"> establishment </span> 
                or the 
                <span class="emphasize">career politicians</span>
                
                who have been in office for decades.
                <!-- <span class="emphasize">decades</span>. -->

                Current bills addressing these issues include:
            </p>  

                <ul>
                    <li> <a href="https://en.wikipedia.org/wiki/For_the_People_Act" target="_blank">H.R. 1 (electoral reform bill)</a>  </li>
                    <li>
                        <a href="https://www.congress.gov/bill/116th-congress/house-joint-resolution/20?q=%7B%22search%22%3A%5B%22term+limits%22%5D%7D&s=1&r=1" target="_blank">
                            Proposed Constitutional amendment to limit congressional term lengths</a>
                    </li>
                </ul>                  
        </section>

        <section class="story-part"> 
            <p>
                <i>Are there more career politicians today than there were in the past? Is this a problem?</i> 
                <br>
                <span class="direction">
                    Continue scrolling for a visual exploration of this issue.
                </span>
            </p>
        </section>

        <section class="blank-story-part"></section>

    </div>
</Scroller>

<style>
    ul.blank {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

	
	[slot="foreground"] {
		pointer-events: none;
	}
	
	[slot="foreground"] section {
		pointer-events: all;
	}
</style>
