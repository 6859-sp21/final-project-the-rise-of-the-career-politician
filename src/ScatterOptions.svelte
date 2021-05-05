<script>
    import { scatterPlotColorVar, scatterPlotSizeVar, scatterPlotXVar, scatterPlotYVar} from './stores.js';

    let options = [
        {id: 'min_age', text: "Age when first joining Congress"},
        {id: 'cumulative_time_sen_and_house', text:'Total time spent in Congress'},
        {id: 'age', text:'Current age'},
        {id: 'nominate_dim1', text: 'Liberal-Conservative Dimension'},
        {id: 'nominate_dim2', text: 'Hot Topics Dimension'}
    ];
</script>

<div class="options">
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