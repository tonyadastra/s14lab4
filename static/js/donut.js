/**
 * @class Donut
 */
class Donut {

    //Variables
    langcount = [];


    // Elements
    svg = null;
    g = null;

    // Configs
    svgW = 360;
    svgH = 360;
    gMargin = {top: 0, right: 0, bottom: 0, left: 0};
    gW = this.svgW - (this.gMargin.right + this.gMargin.left);
    gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);

    // Tools
    color = d3.scaleOrdinal()
        .range(["#3fb4bf", "#b46cc2", "#2975c7", "#c95a1e", "#a05d56", "#53e6a1"])

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
            .attr("transform", "translate(" + vis.svgW / 2 + "," + vis.svgH / 2 + ")");
            // .style("transform", `translate(${vis.svgW / 2}px, ${vis.svgH / 2}px)`);
            // .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

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
        vis.langcount = d3.nest()
            .key(function(d) { return d.prog_lang})
            .rollup(function (v) { return v.length })
            .object(this.data);
        console.log(vis.langcount)

        // for (let i = 0; i < vis.langcount.length; i++){
        //     vis.donut_data.push([vis.langcount[i].key, vis.langcount[i].value]);
        // }
        // console.log(vis.donut_data)


        // Map colors


        // Calculate the position of each pie


        // Now render
        vis.render();
    }

    /** @function render()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;

        var color_fill = vis.color.domain(vis.langcount);

        var pie = d3.pie()
          .value(function(d) {return d.value; });
        var data_ready = pie(d3.entries(vis.langcount));
        console.log(data_ready)



        vis.g.selectAll('whatever')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', d3.arc()
            .innerRadius(100)         // This is the size of the donut hole
            .outerRadius(150)
          )
          .attr('fill', function(d){ return(color_fill(d.data.key)) })
          .attr("stroke", "black")
          .style("stroke-width", "2px")
          .style("opacity", 0.7)

    }
}