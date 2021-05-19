<script>
    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';
    export let d;
    export let x;
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
            text: "I am outlier",
            event: event,
            data: d
        });
    };

</script>
<circle
r=3
cx={(Math.random() - .5) * 30}
cy={y(d.y)}
fill=black
on:mouseover={sendInfo}
on:mouseout={sendInfo}
on:mousemove={sendInfo}
/>
