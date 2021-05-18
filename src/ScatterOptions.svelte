<script>
    import { scatterPlotColorVar, scatterPlotSizeVar, scatterPlotXVar, 
        scatterPlotYVar, scatterPlotYear, scatterShowOptions, scatterRepType} from './stores.js';
    export let options;

    options = Object.entries(options).map((x) => ({id: x[0], text: x[1]}))
</script>

<div class="options">
    <button on:click={() => $scatterShowOptions = !$scatterShowOptions}>
        {$scatterShowOptions ? "Collapse Options" : "Reveal Options"}
    </button>
    {#if $scatterShowOptions}
    <ul>
        <li>
            year: {$scatterPlotYear}
            <input type=range bind:value={$scatterPlotYear} min=1790 max=2021>            
        </li>
        <li>
            x-axis: 
            <select bind:value={$scatterPlotXVar}>
                {#each options as o}
                <option value={o.id}>
                    {o.text}
                </option>
                {/each}
            </select>    
        </li>

        <li>
            y-axis: 
            <select bind:value={$scatterPlotYVar}>
                {#each options as o}
                <option value={o.id}>
                    {o.text}
                </option>
                {/each}
            </select>    
        </li>
        <li>
            color: 
            <select bind:value={$scatterPlotColorVar}>
                {#each options as o}
                <option value={o.id}>
                    {o.text}
                </option>
                {/each}
            </select>    
        </li>

        <li>
            size: 
            <select bind:value={$scatterPlotSizeVar}>
                {#each options as o}
                <option value={o.id}>
                    {o.text}
                </option>
                {/each}
            </select>
        </li>

        <li>
            <form>
                <label>
                  <input type="radio" bind:group={$scatterRepType} value={"both"} />
                  Both
                </label>
          
                <label>
                  <input type="radio" bind:group={$scatterRepType} value={"sen"} />
                  Senate
                </label>
          
                <label>
                  <input type="radio" bind:group={$scatterRepType} value={"rep"} />
                  House
                </label>
              </form>
        </li>
    </ul>
    {/if}
</div>

<style>
    .options {
        position: fixed;
        left: 85%;
        top: 30%;
        width: auto;
    }

    ul, li {
        list-style: none;
        margin: 0;
        padding: 0;
        /* text-align: left; */
    }
</style>