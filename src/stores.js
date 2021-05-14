import { writable } from 'svelte/store';

export const winWidth = writable(window.innerWidth);
export const winHeight = writable(window.innerHeight);
export const currentSection = writable('intro');
export const startedScrolling = writable(false);

//Bubbleplot
export const bubbleN = writable(2021);
export const bubbleShowAnnotation = writable(true);

//Boxplot 
export const boxplotOutcomeVar = writable('cumulative_time_sen_and_house');
export const boxplotRepType = writable('both');
export const showLifeExpectancy = writable(false);

// Scatterplot
export const scatterPlotXVar = writable('nominate_dim1');
export const scatterPlotYVar = writable('cumulative_time_sen_and_house');
export const scatterPlotSizeVar = writable('cumulative_time_sen_and_house');
export const scatterPlotColorVar = writable('nominate_dim1');
export const scatterPlotYear = writable(2021);