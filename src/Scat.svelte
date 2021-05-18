<script>
    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    export let d;
    export let x;
    export let y;
    export let color = "black";
    export let r;
    
    const dispatch = createEventDispatcher();
    function sendInfo(event) {
        dispatch(event.type, {
            text: "Hi there",
            event: event,
            data: {data: d}
        });
    };

</script>

<circle
transform={`translate(${x},${y})`}
id = {d.official_full.replace(' ', '_')}
r={r}
fill={color}
stroke=black
on:mouseover={sendInfo}
on:mouseout={sendInfo}
on:mousemove={sendInfo}
/>
