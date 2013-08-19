function chart4() {

    // Various accessors

    function x(d) {
        return d.time;
    }

    function y(d) {
        return d.value;
    }

    // Chart dimensions.
    var margin = {
        top: 5.5,
        right: 19.5,
        bottom: 5.5,
        left: 79.5
    },
        width = 560,
        height = 75 - margin.top - margin.bottom;

    // Load the dummy data here
    var data = randomData(), 
        extentOfX = d3.extent(data, function(d){ return d.time; }),
        domainOfY = [-100, 100];
    
    // Various scales and distortions.
    var xScale = d3.fisheye.scale(d3.time.scale).domain(extentOfX).range([0, width]),
        yScale = d3.scale.linear().domain(domainOfY).range([height, 0]);

    var xFormatSeconds = d3.time.format("%S"),
        xFormatMinutes = d3.time.format("%M"); 

    // The x & y axes.
    var xAxis = d3.svg.axis().orient("bottom").scale(xScale).
            tickFormat(tickFormatter).
            tickSize(-height).
            tickPadding(20).
            ticks(d3.time.seconds, 15),

        yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(-width).ticks(0);

    // Create the SVG container and set the origin.
    var svg = d3.select("#chart4").append("svg").
        attr("width", width + margin.left + margin.right).
        attr("height", height + margin.top + margin.bottom).
        append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line().
        interpolate("monotone").
        x(function (d, i){
            return xScale(x(d));
        }).
        y(function (d, i) {
            return yScale(y(d));
        });

    var filter = svg.append("defs")
      .append("filter")
        .attr("id", "blur")
      .append("feGaussianBlur")
        .attr("stdDeviation", 2.5);

    // Add a background rect for mousemove.
    svg.append("rect").
        attr("class", "background").
        attr("width", width).
        attr("height", height).
        attr("fill", "#F3B903");
    
    var marker = svg.append("g").attr("class", "markers"), markerHeight = 25;
    marker.append("rect").
        attr("class", "marker").
        attr("width", 2).
        attr("height", markerHeight).
        attr("fill", "#FF5200").
        attr("filter", "url(#blur)").
        attr("transform", "translate(0," + (height/2 - markerHeight/2) + ")");
    marker.append("rect").
        attr("class", "marker").
        attr("width", 1).
        attr("height", markerHeight).
        attr("fill", "#FF5200").
        attr("transform", "translate(0," + (height/2 - markerHeight/2) + ")");


    // Add the x-axis.
    svg.append("g").
        attr("class", "x axis").
        attr("transform", "translate(0," + height/2 + ")").
        call(xAxis);
    
    // Add the y-axis.
    svg.append("g").
        attr("class", "y axis").
        call(yAxis);
    
    var lineRendered = svg.append("svg:path").
        attr("class", "line").
        attr("d", line(data));


    svg.on("mousemove", function() {
        var mouse = d3.mouse(this), dataInterval;
        positionMarker(mouse);
        xScale.distortion(1.5).focus(mouse[0]);
        lineRendered.attr("d", line(data));
        svg.select(".x.axis").call(xAxis);
        //dataInterval = whichInterval(mouse[0]);
    });


    function positionMarker (xy) {
        marker.selectAll("rect").
            attr("transform", "translate(" + xy[0] + "," + (height/2 - markerHeight/2) + ")");
    }

    function tickFormatter (d, i) {
        var displayableSeconds = {15: 1, 30: 1, 45: 1},
            seconds = xFormatSeconds(d),
            minutes = xFormatMinutes(d) || 1;
        return seconds in displayableSeconds ? "" : minutes;
    }

    function whichInterval (xC) {
        var interval = [0, 0], dataInterval = [], displayableSeconds = {15: 1, 30: 1, 45: 1},
            firstElementGreater = false;
        
        data.filter(function(d){
            return !(xFormatSeconds(new Date(x(d))) in  displayableSeconds)
        }).forEach(function(d){
            var xCoordinate = xScale(x(d));
            if (xCoordinate <= xC && interval[0] <= xCoordinate){
                interval[0] = xCoordinate;
                dataInterval[0] = d;
                dataInterval[0].tt = xFormatMinutes(new Date(x(d)));
            }
            if (xCoordinate >= xC && !firstElementGreater){
                interval[1] = xCoordinate;
                dataInterval[1] = d;
                dataInterval[1].tt = xFormatMinutes(new Date(x(d)));
                firstElementGreater = true;
            }
        });

        return data.filter(function(d){
            return d.time >= dataInterval[0].time && d.time <= dataInterval[1].time;
        });
    }

};