<script>
    import { createEventDispatcher } from 'svelte';

    export let d;
    const colorDict = {'Republican': 'red',
                        'Democrat': 'blue'}

       
    const dispatch = createEventDispatcher();

    function sendInfo(event) {
        dispatch(event.type, {
            text: "Hi there",
            event: event
        });
    };
</script>

<g
    on:mouseover={sendInfo}
    on:mouseout={sendInfo}
    on:mousemove={sendInfo}
    >
    <circle 
    cx = {d.x}
    cy = {d.y}
    r = {d.r}
    fill = {colorDict[d.data.party] ? colorDict[d.data.party] : 'green'}
    />
    <text 
    x = {d.x}
    y = {d.y}
    text-anchor = "middle"
    textLength = {1.7*d.r}
    class = 'bubble-text'>{d.data.wikipedia} ({d.data.time_sen_and_house})</text>
</g>

<style>
    .bubble-text {
        font: bold .5em sans-serif;
        fill: white;        
    }
</style>