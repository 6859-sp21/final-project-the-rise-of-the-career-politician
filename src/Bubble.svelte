<script>
    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    export let d;
    export let displayVar;

    let name; 
    $: {
        name = d.data.official_full;
        if (name === undefined || name === "unknown") 
        name = d.data.wikipedia;
    }
    console.log('bubble for ', name);
    const colorDict = {'Republican': 'red',
                        'Democrat': 'blue'}

       
    const dispatch = createEventDispatcher();
    function sendInfo(event) {
        dispatch(event.type, {
            text: "Hi there",
            event: event,
            data: d
        });
    };

    onDestroy(d => console.log("Bubble being destroyed"));
</script>
<g
    on:mouseover={sendInfo}
    on:mouseout={sendInfo}
    on:mousemove={sendInfo}
    transition:fade
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
    class = 'bubble-text'>{name}</text>
    <text
    x = {d.x}
    y = {d.y + .35*d.r}
    text-anchor = "middle"
    class = 'bubble-text'
    >{d.data[displayVar]} Years</text>
</g>

<style>
    .bubble-text {
        font: bold .5em sans-serif;
        fill: white;        
    }
</style>