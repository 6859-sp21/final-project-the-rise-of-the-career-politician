<script>
import { xlink_attr } from 'svelte/internal';

    import { scatterPlotColorVar, scatterPlotSizeVar, scatterPlotXVar, scatterPlotYVar} from './stores.js';
    export let options;

    let showSettings = false;
    options = Object.entries(options).map((x) => ({id: x[0], text: x[1]}))
</script>

<div class="options">
    <button on:click={() => showSettings = !showSettings}>
        {showSettings ? "Collapse Options" : "Reveal Options"}
    </button>
    {#if showSettings}
    <ul>
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
    </ul>
    {/if}
</div>

<style>
    .options {
        float: center;
        width: auto;
    }

    ul {
        list-style: none;
    }
</style>