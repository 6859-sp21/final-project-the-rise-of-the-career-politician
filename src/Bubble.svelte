<script>
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    import { md5 } from './md5.js';
    export let d;
    let notLoaded = true;
    const colorDict = {'Republican': 'red',
                        'Democrat': 'blue'}

       
    const dispatch = createEventDispatcher();

    function getWikiPhoto() {
	// https://stackoverflow.com/questions/34393884/how-to-get-image-url-property-from-wikidata-item-by-api
        const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims` + 
            `&property=P18&entity=${d.data.wikidata}&format=json&origin=*`
        let promise = fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            const pictureName = data.claims.P18[0].mainsnak.datavalue.value
                                                     .replaceAll(' ', '_');
                            const md5sum = md5(pictureName);
                            // console.log('picture name', pictureName, 'md5', md5sum)
                            const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${md5sum[0]}/${md5sum.slice(0,2)}/${pictureName}`
                            // console.log(imageUrl)
                            return imageUrl
                        })
        return promise;
    }

    function mouseOver(event) {
        getWikiPhoto().then(x => {
            dispatch(event.type, {
                text: "Hi there",
                event: event,
                image: x,
                data: d
            });
        });
    };

    function sendInfo(event) {
        dispatch(event.type, {
            text: "Hi there",
            event: event
        });
    };
</script>

<g
    on:mouseover={mouseOver}
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
    class = 'bubble-text'>{d.data.wikipedia} ({d.data.time_sen_and_house})</text>
</g>

<style>
    .bubble-text {
        font: bold .5em sans-serif;
        fill: white;        
    }
</style>