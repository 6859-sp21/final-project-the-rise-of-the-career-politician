<script>
    import { createEventDispatcher } from 'svelte';
    import { md5 } from './md5.js';
    export let d;
    let notLoaded = true;
    const colorDict = {'Republican': 'red',
                        'Democrat': 'blue'}

       
    const dispatch = createEventDispatcher();

    function getWikiPhoto() {
	/* 
	https://stackoverflow.com/questions/34393884/how-to-get-image-url-property-from-wikidata-item-by-api

	1. query entity name https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=Q518823&format=json
	2. take picture value and md5 hash it
	3. image is at https://upload.wikimedia.org/wikipedia/commons/f/f7/Richard_bassett.jpg
	f is first digit of md5, f7 are first two, end with name
	*/
        const url = `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${d.data.wikidata}&format=json&origin=*`
        let promise = fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                            const pictureName = data.claims.P18[0].mainsnak.datavalue.value
                                                     .replaceAll(' ', '_');
                            const md5sum = md5(pictureName);
                            console.log('picture name', pictureName, 'md5', md5sum)
                            const imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${md5sum[0]}/${md5sum.slice(0,2)}/${pictureName}`
                            console.log(imageUrl)
                            return imageUrl
                        })
                        // .then(url => fetch(url))
                        // .then(response => response.blob())
        return promise;
    }
    function sendInfo(event) {
        var temp = "no image"
        if (d.data.wikipedia == "Bobby Rush" && notLoaded) {
            getWikiPhoto().then(x => {
                console.log('logging', x)
                dispatch(event.type, {
                    text: "Hi there",
                    image: x, 
                    event: event
                });
            }

            )
            notLoaded = false;
        }
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