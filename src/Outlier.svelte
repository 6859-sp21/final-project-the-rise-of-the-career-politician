<script>
    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    export let d;
    export let y;

    let name; 
    $: {
        name = d.data.official_full;
        if (name === undefined || name === "unknown") 
        name = d.data.wikipedia;
    }

       
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
<circle
r=3
cx={(Math.random() - .5) * 4}
cy={y(d.y)}
on:mouseover={sendInfo}
on:mouseout={sendInfo}
on:mousemove={sendInfo}
/>
