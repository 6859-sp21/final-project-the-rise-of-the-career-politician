<script>
	import { fade, draw, fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    export let b;
    export let x;
    export let y;


    function getPath(d){
        return `
        M${x((d.x0 + d.x1) / 2)},${y(d.range[1])}
        V${y(d.range[0])}`;
    };

    function getPath2(d){
       return `
        M${x(d.x0) + 1},${y(d.quartiles[2])}
        H${x(d.x1)}
        V${y(d.quartiles[0])}
        H${x(d.x0) + 1}
        Z`;
    };

    function getPath3(d){
        return `
        M${x(d.x0) + 1},${y(d.quartiles[1])}
        H${x(d.x1)}`;
    };

    const dispatch = createEventDispatcher();
    function sendInfo(event) {
        dispatch(event.type, {
            text: "Hi there",
            event: event,
            data: b
        });
    };
</script>

<path
    stroke=currentColor
    d={getPath(b)}
    transition:fade="{{duration: 1000}}"
></path>

<path
    fill="#ddd"
    transition:fade="{{duration: 1000}}"
    d={getPath2(b)}
    on:mouseover={sendInfo}
    on:mouseout={sendInfo}
    on:mousemove={sendInfo}>
</path>

<path
    stroke=currentColor
    transition:fade="{{duration: 1000}}"
    d={getPath3(b)}>
</path>