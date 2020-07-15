/**
 * @class Donut
 */
class Donut {

    //Variables
    langcount = [];
    color_fill = null;


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
        .range(["#3fb4bf", "#e2248b", "#2975c7",
            "#ea5a2d", "#5f42a3", "#53e6a1"])

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
        // .object would make it return in the same format needed for pie chart
        vis.langcount = d3.nest()
            .key(function(d) { return d.prog_lang})
            .rollup(function (v) { return v.length })
            .object(this.data);
        // console.log(vis.langcount)

        // Maps colors
        vis.color_fill = vis.color.domain(vis.langcount);

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

        // Calculates and returns the position of each pie
        /** d.value has to be in the form of {"key": "value"}
         * for example: {js: 12}. This transformation is made
         * using .object(this.data) */
        var pie = d3.pie()
          .value(function(d) {return d.value; });
        var data_ready = pie(d3.entries(vis.langcount));
        //Use console.log to check data
        console.log(data_ready)

        // Adds a div to html, reposition to the center of the page using css,
        // returns programming language
        var div = d3.select("body").append("div")
            .attr("class", "tooltip-donut")
            .style("opacity", 0);

        // Adds another div to html, returns number of people
        var divCount = d3.select("body").append("div")
            .attr("class", "tooltip-donut-2")
            .style("opacity", 0);

        // Displays the donut chart
        vis.g.selectAll('whatever')
          .data(data_ready)
          .enter()
          .append('path')
          .attr('d', d3.arc()
            .innerRadius(100)         // This is the size of the donut hole
            .outerRadius(150)
          )
            .attr('fill', function(d){ return(vis.color_fill(d.data.key)) })
            .attr("stroke", "black")
            .style("stroke-width", "1.7px")
            // .style("opacity", 0.9)

            /** Adds effect (reduce opacity) when hovering
             * Define type(programming languages) and count(number of people)
             */
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '0.65');

                // Mouseover -> show textbox = set opacity to 1
                div.transition()
                   .duration(50)
                   .style("opacity", 1);
                divCount.transition()
                   .duration(50)
                   .style("opacity", 1);

                // Define type
                let type = (d.data.key);
                // .html command transmits the data to html
                div.html(type)
                // Define count
                let count = (d.value);
                // .html command transmits the data to html
                divCount.html(count)

                // The following commands are needed for tool-kit
               // .style("left", (d3.event.pageX + 10) + "px")
               // .style("top", (d3.event.pageY - 15) + "px");
            })

            /** Removes effect when mouseout */
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '0.9');

                // Mouseout -> hide textbox = set opacity to 0
                div.transition()
                    .duration('50')
                    .style("opacity", 0);
                divCount.transition()
                    .duration('50')
                    .style("opacity", 0);
            })
    }
}