<script>
    import { axisRight } from 'd3-axis';
    export let width;
    export let height; 
    export let scale; 
    let el;

    let legendMargin = { top: 50, bottom: 20, left: 50, right: 20 };

    $: {
        let legendSvg = d3.select(el)
            .attr('transform', 'translate(' + legendMargin.left + ',' +
            legendMargin.top + ')');

        updateColourScale(scale);


    // update the colour scale, restyle the plot points and legend
    function updateColourScale(scale) {
        // style points

        // clear current legend
        legendSvg.selectAll('*').remove();

        // append gradient bar
        var gradient = legendSvg.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%') // bottom
            .attr('y1', '100%')
            .attr('x2', '0%') // to top
            .attr('y2', '0%')
            .attr('spreadMethod', 'pad');

        // programatically generate the gradient for the legend
        // this creates an array of [pct, colour] pairs as stop
        // values for legend
        let ticks = scale.ticks()
        let pct = ticks
            .map(d => (d - ticks[0]) / (ticks[ticks.length-1] - ticks[0]) * 100)
            .map(d => Math.round(d) + '%');
        
        var colourPct = d3.zip(pct, ticks.map(d => scale(d)));

        colourPct.forEach(function(d) {
            gradient.append('stop')
                .attr('offset', d[0])
                .attr('stop-color', d[1])
                .attr('stop-opacity', 1);
        });

        legendSvg.append('rect')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'url(#gradient)');

        // // create a scale and axis for the legend
        var legendScale = d3.scaleLinear()
            .domain(d3.extent(ticks))
            .range([height, 0]);

        var legendAxis = axisRight()
            .scale(legendScale)
            .tickValues(ticks)
            .tickFormat(d3.format("d"));

        legendSvg.append("g")
            .attr("class", "legend axis")
            .attr("transform", "translate(" + width + ", 0)")
            .call(legendAxis);
    }

}
</script>

<g bind:this={el}> </g>
