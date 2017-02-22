/**
 * @name SenseUI-ComboChart
 * @author yianni.ververis@qlik.com
 * @requires string: 1 Dimension and at least 1 Measure
 * @param {integer} vars.font.size: 
 * @param {string} vars.font.color:
 * @param {boolean} vars.legend:
 * @param {boolean} vars.enableSelections:
 * @description
 * A simple Combo Chart
 * @version 1.4: Add text on top of the bars
 * @version 1.3: Distribute Bars evenly
 * @version 1.2: Added Tooltips
 * @version 1.1: Added 2nd line
 * @version 1.0: Initial Setup
 */

define( [ 
	"qlik",
	"jquery",
	'css!./SenseUI-ComboChart.css',
	"./d3.v3.min",
	'./d3-tip'
],
(qlik, $, css, d3) => {
	// Define properties
	var me = {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 4,
					qHeight: 1000
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},
				measures: {
					uses: "measures",
					min: 1,
					max: 3
				},
				sorting: {
					uses: "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						general: {
							type: "items",
							label: "General",
							items: {
								fontSize: {
									type: "integer",
									expression: "none",
									label: "Text Size",
									defaultValue: "10",
									ref: "vars.font.size"
								},
								fontColor: {
									type: "string",
									expression: "none",
									label: "Font Color",
									defaultValue: "#000000",
									ref: "vars.font.color"
								},
								displayLegend: {
									type: "boolean",
									component: "switch",
									label: "Display Legend",
									ref: "vars.legend",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								enableSelections: {
									type: "boolean",
									component: "switch",
									label: "Enable Selections",
									ref: "vars.enableSelections",
									options: [{
										value: true,
										label: "On"
									}, {
										value: false,
										label: "Off"
									}],
									defaultValue: true
								},
								mashupDiv: {
									type: "string",
									expression: "none",
									label: "What is the mashup div id to calculate correct positioning",
									defaultValue: "main",
									ref: "vars.tooltip.divid"
								},
							},
						},
						customBar: {
							type: "items",
							label: "Bar Chart",
							items: {
								barColor: {
									type: "string",
									expression: "none",
									label: "Bar Color",
									defaultValue: "#4682B4",
									ref: "vars.bar.color"
								},
								barColorHover: {
									type: "string",
									expression: "none",
									label: "Bar Hover Color",
									defaultValue: "#77B62A",
									ref: "vars.bar.hover"
								},
								barWidth: {
									type: "integer",
									expression: "none",
									label: "Bar Width (0 for auto scaling)",
									defaultValue: "0",
									ref: "vars.bar.width"
								},
								barBorderColor: {
									type: "string",
									expression: "none",
									label: "Bar Border Color",
									defaultValue: "#4682B4",
									ref: "vars.bar.borderColor"
								},
								barBorderWidth: {
									type: "integer",
									expression: "none",
									label: "Bar Border Width",
									defaultValue: "1",
									ref: "vars.bar.borderWidth"
								}
							},
						},
						customLine1: {
							type: "items",
							label: "Measure 1",
							show : function(data) {
								if (data.qHyperCubeDef.qMeasures.length>1) {
									return true;
								}
							},
							items: {
								measure1type: {
									type: "boolean",
									component: "switch",
									label: "Bar / Line",
									ref: "vars.measure1.type",
									options: [{
										value: true,
										label: "Bar"
									}, {
										value: false,
										label: "line"
									}],
									defaultValue: false
								},
								lineColor: {
									type: "string",
									expression: "none",
									label: "Line Color",
									defaultValue: "#ec5e08",
									ref: "vars.line.color",
									show : function(data) {
										if (!data.vars.measure1.type) {
											return true;
										}
									}
								},
								lineWidth: {
									type: "string",
									expression: "none",
									label: "Line Width",
									defaultValue: "1",
									ref: "vars.line.width",
									show : function(data) {
										if (!data.vars.measure1.type) {
											return true;
										}
									}
								},
								dotColor: {
									type: "string",
									expression: "none",
									label: "Dot Color",
									defaultValue: "#ec5e08",
									ref: "vars.dot.color",
									show : function(data) {
										if (!data.vars.measure1.type) {
											return true;
										}
									}
								},
								dotStrokeColor: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Color",
									defaultValue: "#ec5e08",
									ref: "vars.dot.strokeColor",
									show : function(data) {
										if (!data.vars.measure1.type) {
											return true;
										}
									}
								},
								dotStrokeWidth: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Width",
									defaultValue: "1",
									ref: "vars.dot.strokeWidth",
									show : function(data) {
										if (!data.vars.measure1.type) {
											return true;
										}
									}
								},
								dotRadius: {
									type: "string",
									expression: "none",
									label: "Dot Radius",
									defaultValue: "3",
									ref: "vars.dot.radius",
									show : function(data) {
										if (!data.vars.measure1.type) {
											return true;
										}
									}
								},
							}
						},
						customLine2: {
							type: "items",
							label: "Line Chart 2",
							show : function(data) {
								if (data.qHyperCubeDef.qMeasures.length>2) {
									return true;
								}
							},
							items: {
								lineColor2: {
									type: "string",
									expression: "none",
									label: "Line Color",
									defaultValue: "#1F78B4",
									ref: "vars.line2.color"
								},
								lineWidth2: {
									type: "string",
									expression: "none",
									label: "Line Width",
									defaultValue: "3",
									ref: "vars.line2.width"
								},
								dotColor2: {
									type: "string",
									expression: "none",
									label: "Dot Color",
									defaultValue: "#1F78B4",
									ref: "vars.dot2.color"
								},
								dotStrokeColor2: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Color",
									defaultValue: "#ec5e08",
									ref: "vars.dot2.strokeColor"
								},
								dotStrokeWidth2: {
									type: "string",
									expression: "none",
									label: "Dot Stroke Width",
									defaultValue: "3",
									ref: "vars.dot2.strokeWidth"
								},
								dotRadius2: {
									type: "string",
									expression: "none",
									label: "Dot Radius",
									defaultValue: "5",
									ref: "vars.dot2.radius"
								},
							}
						}
					}
				}
			}
		}
	};

	me.support = {
		snapshot: true,
		export: true,
		exportData : false
	};

	// Get Engine API app for Selections
	me.app = qlik.currApp(this);

	me.paint = function($element,layout) {
		var vars = $.extend(true,{
			v: '1.4',
			id: layout.qInfo.qId,
			name: 'SenseUI-ComboChart',
			width: $element.width(),
			contentWidth: $element.width(),
			height: $element.height(),
			margin: {top: 20, right: 20, bottom: 40, left: 40},
			dimension: layout.qHyperCube.qDimensionInfo[0].title,
			measure1: {
				label: layout.qHyperCube.qMeasureInfo[0].qFallbackTitle,
			},
			measure2: {
				label: (layout.qHyperCube.qMeasureInfo[1]) ? layout.qHyperCube.qMeasureInfo[1].qFallbackTitle : null,
			},
			measure3: {
				label: (layout.qHyperCube.qMeasureInfo[2]) ? layout.qHyperCube.qMeasureInfo[2].qFallbackTitle : null,
			},
			data: [],
			this: this
		}, layout.vars);	
		vars.bar.total = layout.qHyperCube.qDataPages[0].qMatrix.length;
		vars.bar.width = parseInt(vars.bar.width)
		vars.dot.radius = parseInt(vars.dot.radius)
		vars.dot2.radius = (vars.dot2) ? parseInt(vars.dot2.radius) : null;
		vars.bar.padding = 5
console.log(vars)		
		if (vars.bar.width) {
			vars.contentWidth = (vars.bar.width + vars.bar.padding) * vars.bar.total + vars.margin.left + vars.margin.right
			vars.margin.bottom += 20;
		}
		if (vars.legend) {
			vars.margin.bottom += 20;
		}
		// CSS
		vars.css = `
			#${vars.id}_inner {
				width: ${vars.width}px;
				height: ${vars.height}px;
				overflow-x: auto !important;
				overflow-y: hidden !important;
			}
			#${vars.id}_inner .content {
				width: ${vars.contentWidth}px;
			}
			#${vars.id}_inner .line {
				fill: none;
				stroke: ${vars.line.color};
				stroke-width: ${vars.line.width}px;
			}
			#${vars.id}_inner .line2 {
				fill: none;
				stroke: ${vars.line2.color};
				stroke-width: ${vars.line2.width}px;
			}
			#${vars.id}_inner .dot {
				fill: ${vars.dot.color};
				stroke: ${vars.dot.strokeColor};
				stroke-width: ${vars.dot.width}px;
			}
			#${vars.id}_inner .dot2 {
				fill: ${vars.dot2.color};
				stroke: ${vars.dot2.strokeColor};
				stroke-width: ${vars.dot2.width}px;
			}
			#${vars.id}_inner .hover {
				fill: ${vars.line.color};
				stroke: ${vars.line.color};
			}
			#${vars.id}_inner .bar {
				fill: ${vars.bar.color};
				stroke: ${vars.bar.borderColor};
				stroke-width: ${vars.bar.borderWidth}px;
			}
			#${vars.id}_inner .bar:hover {
				fill: ${vars.bar.hover};
				cursor: pointer;
			}
			#${vars.id}_inner .title {
				font: bold 14px "Helvetica Neue", Helvetica, Arial, sans-serif;
			}
			#${vars.id}_inner,
			#${vars.id}_inner .legend,
			#${vars.id}_inner .axis {
				font: ${vars.font.size}px sans-serif;
				color: ${vars.font.color};
			}
			#${vars.id}_inner .axis path,
			#${vars.id}_inner .axis line {
				fill: none;
				stroke: #CCC;
				shape-rendering: crispEdges;
			}
			#${vars.id}_inner .x.axis path {
				display: none;
			}
			#${vars.id}_inner .legend .column {
				display: inline-block;
				padding-right: 10px;
			}
			#${vars.id}_inner .legend .column .box {
				width: 10px;
				height: 10px;
				display: inline-block;
				margin-right: 5px;
			}
			.d3-tip .box.measure1,
			#${vars.id}_inner .legend .column .box.measure1 {
				background-color: ${vars.bar.color};
			}
			.d3-tip .box.measure2,
			#${vars.id}_inner .legend .column .box.measure2 {
				background-color: ${vars.line.color};
			}
			.d3-tip .box.measure3,
			#${vars.id}_inner .legend .column .box.measure3 {
				background-color: ${vars.line2.color};
			}
			#${vars.id}_inner .grid .tick {
				stroke: grey;
				opacity: 0.2;
			}
			#${vars.id}_inner #grid line {
				stroke: grey;
				stroke-width: 0.5;
				opacity: 0.5;
			}
		`;

		// TEMPLATE
		vars.template = `
			<div id="${vars.id}_inner">
				<div class="content"></div>
			</div>
		`;

		// Write Css and html
		$("<style>").html(vars.css).appendTo("head")
		$element.html(vars.template)

		vars.barWidth = (vars.width-vars.margin.left-vars.margin.right-5)/vars.bar.total
		vars.data = layout.qHyperCube.qDataPages[0].qMatrix.map(function(d) {
			return {
				"dimension":d[0].qText,
				"qElemNumber":d[0].qElemNumber,
				"measure": d[1].qText,
				"measureNum": d[1].qNum,
				"measure2": (d[2]) ? d[2].qText : null,
				"measureNum2": (d[2]) ? d[2].qNum : null,
				"measure3": (d[3]) ? d[3].qText : null,
				"measureNum3": (d[3]) ? d[3].qNum : null
			}
		});

		var margin = vars.margin,
			width = vars.width - margin.left - margin.right,
			height = vars.height - margin.top - margin.bottom;
		
		if (vars.bar.width) {
			var tempWidth = (vars.bar.width + vars.bar.padding) * vars.bar.total + vars.margin.left + vars.margin.right;
			if (tempWidth > width) {
				width = tempWidth;
			}
		}

		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(3, "")
			.tickFormat(function(d,i){
				return roundNumber(d); 
			})
			
		var svg = d3.select(`#${vars.id}_inner .content`).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// Create Parent Group layering
		svg.append("g").attr("id", "grid");

		x.domain(vars.data.map(function(d) { return d.dimension; }));
		y.domain([0, d3.max(vars.data, function(d) { return d.measureNum; })]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.selectAll(".tick text")
			.call(wrap, (vars.bar.width) ? vars.bar.width : x.rangeBand());

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		// Add bottom horizontal line (x-axis)
		svg.select("#grid")
			.append("line")
			.attr("x1", 0)
			.attr("y1", height)
			.attr("x2", width)
			.attr("y2", height)

		// Add the bars	
		svg.selectAll(".bar")
			.data(vars.data)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { 
				if (vars.bar.width) {
					return x(d.dimension)+ (x.rangeBand()-(vars.bar.width))/2;
				} else {
					return x(d.dimension);
				}
			})
			.attr("width", (vars.bar.width) ? vars.bar.width : x.rangeBand())
			.attr("y", function(d) { return y(d.measureNum); })
			.attr("height", function(d) { return height - y(d.measureNum); })			
			.on('mouseover', function(d,i){
				tip.show(d, i); 
				setTimeout(function(){tip.hide();}, 10000);
			})
			.on('mouseleave', function(d,i){
				tip.hide();
			})
			.on('click', function(d,i) {
				if (vars.enableSelections) {
					vars.this.backendApi.selectValues(0, [d.qElemNumber], true);
				}
			});
		
		// Add the text on top of the bars
		svg.selectAll(".text")
			.data(vars.data)
			.enter().append("text")
			.text(function(d) {
				return roundNumber(d.measureNum);
			})
			.attr("x", function(d, i) { 
				// if (vars.bar.width) {
				// 	return x(d.dimension)+ (x.rangeBand()-(vars.bar.width-vars.bar.width))/2;
				// } else {
				// 	console.log(d)
					return x(d.dimension) + x.rangeBand()/2;
				// }
			})
			.attr("y", function(d) { return y(d.measureNum)-5; })
			.attr("text-anchor", 'middle')

		// Create the Line Chart only if there is a 2nd measure
		if (vars.measure2.label) {
			var y2 = d3.scale.linear()
				.range([height, 0])
				.domain([0, d3.max(vars.data, function(d) { return d.measureNum2; })]);
			var line = d3.svg.line()
				.x(function(d) { return x(d.dimension); })
				.y(function(d) { return y2(d.measureNum2); })
			// Create the line
			svg.append("g").attr("id", "line")
				.append("path")
				.datum(vars.data)
					.attr("class", "line")
					.attr("transform", `translate(${x.rangeBand()/2},0)`)
					.attr("d", line)
			// Add the dots
			svg.selectAll("dots")
				.data(vars.data)
				.enter().append("circle")
					.attr("class", "dot")
					.attr("r", vars.dot.radius)
					.attr("cx", function(d) { return x(d.dimension); })
					.attr("cy", function(d) { return y2(d.measureNum2); })
					.attr("transform", `translate(${x.rangeBand()/2},0)`)
		}

		// Create the Line Chart only if there is a 2nd measure
		if (vars.measure3.label) {
			var y3 = d3.scale.linear()
				.range([height, 0])
				.domain([0, d3.max(vars.data, function(d) { return d.measureNum3; })]);
			var line2 = d3.svg.line()
				.x(function(d) { return x(d.dimension); })
				.y(function(d) { return y3(d.measureNum3); })
			// Create the line
			svg.append("g").attr("id", "line2")
				.append("path")
				.datum(vars.data)
					.attr("class", "line2")
					.attr("transform", `translate(${x.rangeBand()/2},0)`)
					.attr("d", line2)
			// Add the dots
			svg.selectAll("dots")
				.data(vars.data)
				.enter().append("circle")
					.attr("class", "dot2")
					.attr("r", vars.dot.radius)
					.attr("cx", function(d) { return x(d.dimension); })
					.attr("cy", function(d) { return y3(d.measureNum3); })
					.attr("transform", `translate(${x.rangeBand()/2},0)`)
		}

		// TOOLTIPS
		var tip = d3.tip()
			.attr('class', vars.id + ' d3-tip')
			.offset([-10, 0])
			.html(function(d,i) {
				var displayMeasure1 = roundNumber(d.measureNum);
				console.log(displayMeasure1)
				var html = `
					<div class="row dimension">${d.dimension}</div>
					<div class="row measure"><div class="box measure1"></div>${vars.measure1}: ${displayMeasure1}</div>
				`;
				if (vars.measure2) {
					var displayMeasure2 = roundNumber(d.measureNum2);
					html += `<div class="row measure"><div class="box measure2"></div>${vars.measure2}: ${displayMeasure2}</div>`;
				}
				if (vars.measure3) {
					var displayMeasure3 = roundNumber(d.measureNum3);
					html += `<div class="row measure"><div class="box measure3"></div>${vars.measure3}: ${displayMeasure3}</div>`;
				}
				return html;
			})
		svg.call(tip);

		// LEGEND
		if (vars.legend) {
			var displayLegend = `<div class="column"><div class="box measure1"></div>${vars.measure1.label}</div>`;
			if (vars.measure2.label) {
				displayLegend += `<div class="column"><div class="box measure2"></div>${vars.measure2.label}</div>`;
			}
			if (vars.measure3.label) {
				displayLegend += `<div class="column"><div class="box measure3"></div>${vars.measure3.label}</div>`;
			}
			svg.append("foreignObject")
				.attr('width', 500)
				.attr('height', 50)
				.attr("y", `${height+40}`)
			.append("xhtml:div")
				.attr("class", "legend")
				.html(displayLegend);
		}

		// WRAP LABELS
		function wrap (text, width) {
			text.each(function() {
				var breakChars = ['/', '&', '-'],
				text = d3.select(this),
				textContent = text.text(),
				spanContent;
				breakChars.forEach(char => {
				// Add a space after each break char for the function to use to determine line breaks
				textContent = textContent.replace(char, char + ' ');
				});

				var words = textContent.split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
				x = text.attr('x'),
				y = text.attr('y'),
				dy = parseFloat(text.attr('dy') || 0),
				tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

				while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(' '));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					spanContent = line.join(' ');
					breakChars.forEach(char => {
						// Remove spaces trailing breakChars that were added above
						spanContent = spanContent.replace(char + ' ', char);
					});
					tspan.text(spanContent);
					line = [word];
					tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
				}
				}
			});

			roundNumber = (num) => {
				num = Math.round(num);
				if (num >= 1000 && num<1000000) {
					num = Math.round(num/1000) + 'K'
				} else if (num >= 1000000) {
					num = Math.round(num/1000000) + 'M'
				}
				return num;
			}
		}

		console.info(`%c ${vars.name}: `, 'color: red', `v ${vars.v}`)
		//needed for export
		return qlik.Promise.resolve()
	};

	// define HTML template	
	// me.template = '';

	// The Angular Controller for binding
	// me.controller = ["$scope", "$rootScope", "$element", function ( $scope, $rootScope, $element ) {}]

	return me
} );

