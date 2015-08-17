angular.module('core.gauge', [])
    .directive('gvmGauge', GvmGaugeDirective);

function GvmGaugeDirective() {
    var uniqueId = 1;

    return {
        template: '<div class="gvm-gauge"></div><div class="inner"></div>',
        restrict: 'E',
        scope: {
            slices: '=',
            inner: '=',
            thickness: '='
        },
        link: link
    };

    //////////////////////////////////////////////////////////////////////////

    function link(scope, element, attrs) {

        var gvmGauge = element.children('.gvm-gauge');
        var defaultWidth = 60;

        scope.$watch(attrs['slices'], function() {
            var countSlices = 0;
            if (angular.isArray(scope.slices)) {
                scope.slices.map(function(slice) {
                    countSlices = countSlices + slice.value;
                });

                if (countSlices < 100) {
                    var diffValue = 100 - countSlices;
                    scope.slices.push({
                        value: diffValue,
                        color: '#e1e1e1'
                    });
                };
            }

            refresh();
        });

        function refresh() {
            var width = parseInt(gvmGauge.css('width'), 10) || defaultWidth;
            var data = [];
            var colors = [];


            angular.forEach(scope.slices, function(slice) {
                data.push(slice.value);

                if (angular.isDefined(slice.color)) {
                    colors.push(slice.color);
                } else {
                    var fakeEl = document.createElement('div');
                    fakeEl.setAttribute('class', 'gvm-gauge ' + slice.classe);
                    document.body.appendChild(fakeEl);

                    colors.push(angular.element(fakeEl).css('color'));

                    fakeEl.parentNode.removeChild(fakeEl);
                    delete fakeEl;
                };
            });


            var imageUrl;
            if (scope.inner && scope.inner['background-image']) {
                imageUrl = scope.inner['background-image'].match(/^url\((.*)\)$/)[1];
            };

            var inner = element.children('.inner');
            var innerWidth = !!scope.thickness ? width - scope.thickness : width * 0.8; //(width * 0.9) - (scope.thickness || (width * 0.72));
            inner.css('width', innerWidth + 'px');
            inner.css('height', innerWidth + 'px');
            inner.css('margin-left', -(innerWidth / 2) + 'px');
            inner.css('margin-top', -(innerWidth / 2) + 'px');

            for (var i in scope.inner) {
                inner.css(i, scope.inner[i]);
            }

            gvmGauge.css('width', width + 'px');
            gvmGauge.css('height', width + 'px');
            gvmGauge.css('left', '50%');
            gvmGauge.css('margin-left', -(width/2) + 'px');

            var containerBaseHeight = parseInt(element.css('height'), 10);;
            element.css('height', 'auto')

            createDonut(gvmGauge[0], width, data, imageUrl, colors, scope.thickness);
        }
    };

    function createDonut(el, width, data, imageUrl, colors, thickness) {
        var id = 'gvmgauge' + uniqueId++;
        width = width || defaultWidth;
        height = width || defaultWidth;
        var colors = colors || ["#000"];

        function yFunction(d) {
            return d;
        };

        function xFunction(d, i) {
            return i;
        };
        var radius = Math.min(width, height) / 2;
        var outerRadius = radius; //radius - 10;
        var innerRadius = radius * 0.8; //radius - 70;
        if (thickness) {
            innerRadius = radius - (thickness / 2);
        };

        var color = d3.scale.ordinal().range(colors);

        d3.select(el).select('svg').remove();

        var arc = d3.svg.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

        var pie = d3.layout.pie()
            .sort(null)
            .value(yFunction);

        var svg = d3.select(el).append("svg")
            .attr("id", id)
            .attr("width", width)
            .attr("height", width);

        // var imageSize = (innerRadius) * 2;
        // if (imageUrl) {
        //     svg.append("defs")
        //         .append("pattern")
        //         .attr("id", "image" + id)
        //         .attr("patternUnits", "userSpaceOnUse") // Strecth
        //         .attr("height", "100%") // Strecth
        //         .attr("width", "100%") // Strecth
        //         //.attr("height", "1") // no-Strecth
        //         //.attr("width", "1") // no-Strecth

        //     .append("image")
        //         .attr("preserveAspectRatio", 'none') // Strecth
        //         .attr("height", "100%") // Strecth
        //         .attr("width", "100%") // Strecth
        //         //.attr("height", imageSize) // no-Strecth
        //         //.attr("width", imageSize) // no-Strecth
        //         .attr("xlink:href", imageUrl);
        // svg.append("circle")
        //     .attr("r", innerRadius)
        //     .attr("cx", width / 2)
        //     .attr("cy", height / 2)
        //     .style("fill", "white");

        // svg.append("circle")
        //     //.attr("class", "donut-image")
        //     .attr("r", innerRadius * 0.9)
        //     .attr("cx", width / 2)
        //     .attr("cy", height / 2)
        //     //.style("stroke", "black") // displays small black dot
        //     //.style("stroke-width", 0.25)
        //     .style("fill", "url(#image" + id + ")");
        // };

        var g = svg.append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d, i) {
                return color(xFunction(d, i));
            });
    }
};