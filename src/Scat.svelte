<script>
    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    export let d;
    export let x;
    export let y;
    export let color = "black";
    export let r;
    
    // console.log(d, x, y)

    const dispatch = createEventDispatcher();
    function sendInfo(event) {
        dispatch(event.type, {
            text: "Hi there",
            event: event,
            data: {data: d}
        });
    };

    onDestroy(d => console.log("Bubble being destroyed"));
</script>

<circle
transform={`translate(${x},${y})`}
r={r}
fill={color}
stroke=black
on:mouseover={sendInfo}
on:mouseout={sendInfo}
on:mousemove={sendInfo}
/>
