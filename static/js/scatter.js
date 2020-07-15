/**
 * @class Scatter
 */
class Scatter {

    //Variables
    expmap = [];
    timemap = [];
    graph_data=[];

    // Elements
    svg = null;
    g = null;
    xAxisG = null;
    yAxisG = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 50, right: 25, bottom: 75, left: 75};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools
    scX = d3.scaleLinear()
            .range([0, this.gW]);
    scY = d3.scaleLinear()
            .range([this.gH, 0]);
    histogram = d3.histogram();
    yAxis = d3.axisLeft().ticks(5);
    xAxis = d3.axisBottom();

    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        // Append axes
        vis.xAxisG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.xAxisG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .text('Years of Experience');
        vis.yAxisG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', 'translateX(-15px)');
        vis.yAxisG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .text('HW1 Hours');


        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;

        // Map variables
        vis.expmap = vis.data.map(d => d.experience_yr);
        vis.timemap = vis.data.map(d => d.hw1_hrs);
        vis.agemap = vis.data.map(d => d.age);

        // Create 2D Array for graphing
        for (let i = 0; i < vis.timemap.length; i++){
            vis.graph_data.push([vis.expmap[i], vis.timemap[i], vis.agemap[i]]);
        }
        // console.log(vis.graph_data);


        // Update scales
        vis.scX.domain([0, d3.max(vis.expmap)]);
        vis.scY.domain([0, d3.max(vis.timemap)]);
        vis.xAxis.scale(vis.scX);
        vis.yAxis.scale(vis.scY);
        // console.log(d3.max(expmap));

        // Now render
        vis.render();
    }

    /** @function wrangle()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        // Build circles
        vis.g.selectAll('.circle')
            .data(vis.graph_data)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'circle')
                    .each(function(d) {
                        // console.log(i)

                        // Define this
                        const g = d3.select(this);

                        // Get data, fit to scale of graph
                        const x = vis.scX(d[0]);
                        const y = vis.scY(d[1]);
                        const a = d[2];
                        // console.log(x)
                        // console.log(y)


                        // Append rect
                        g.append('circle')
                            .attr('cx', x)
                            .attr('cy', y)
                            .attr('r', a/10)
                            .attr('fill', 'rgba(137, 0, 206, 1)');

                    })
            );

        // Update axis
        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);

    }
}