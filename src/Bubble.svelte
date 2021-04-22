<script>
import { dataset_dev } from "svelte/internal";

    export let d;
    const colorDict = {'Republican': 'red',
                        'Democrat': 'blue'}

    function handleClick() {
        console.log('clicked')
    }

    function handleHover() {
        console.log('hovered')
    }
</script>

<g>
    <circle 
    cx = {d.x}
    cy = {d.y}
    r = {d.r}
    fill = {colorDict[d.data.party] ? colorDict[d.data.party] : 'green'}
    on:click={handleClick}
    on:mouseover={handleHover}
    />
    <text 
    x = {d.x - d.data.wikipedia.length*2.2} 
    y = {d.y}
    class = 'bubble-text'>{d.data.wikipedia} ({d.data.time_sen_and_house})</text>
</g>


<style>
    .bubble-text {
        font: bold .5em sans-serif;
        fill: white;        
    }
</style>