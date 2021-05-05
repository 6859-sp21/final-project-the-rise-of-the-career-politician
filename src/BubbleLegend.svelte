<script>
import { winWidth, winHeight } from './stores.js';
    
let r = 20;
let spacing = 100;
let options = [
    ["Republican", "red"],
    ["Democrat", "blue"],
    ["Other", "green"],
];

let height = .2*$winHeight;
let width = .4*$winWidth;
let yStart = height/6;
let xStart = width/3;


</script>

<svg width={width} height={height}>
    {#each options as o, i}
        <circle 
            cx = {xStart + i*(spacing+r)} 
            cy = {yStart}
            r = {r}
            fill = {o[1]}
        />
        <text
        x = {xStart + i*(spacing+r)} 
        y = {yStart}
        text-anchor="middle"
        font-size={8}
        fill='white'>Years in</text>
        <text
        x = {xStart + i*(spacing+r)} 
        y = {yStart+8}
        text-anchor="middle"
        font-size={8}
        fill='white'>Congress</text>
        <text
        x = {xStart + (r+spacing)*i }
        y = {yStart + 2*r} 
        text-anchor="middle"
        font-size={10}
        >{o[0]}</text>
    {/each}
</svg>