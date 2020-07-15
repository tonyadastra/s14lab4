'use strict';

// Init variables
let data = [];
let bars, donut, scatter = null;

d3.json('/load_data').then(d => {

    // Redefine
    data = d.users;

    // Print user count
    d3.select('#users').append('span')
        .text(data.length);

    // Instantiate
    bars = new Bars(data, 'vis1');
    donut = new Donut(data, 'vis2');
    scatter = new Scatter(data, 'vis3');


}).catch(err => console.log(err));