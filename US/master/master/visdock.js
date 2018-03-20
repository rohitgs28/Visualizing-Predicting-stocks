/* ------------------------------------------------------------------
 * visdock.js
 *
 * Created Spring 2013 by Jungu Choi, Yuetling Wong, Eli Fisher, and
 * Niklas Elmqvist.
 * ------------------------------------------------------------------
 */

// Create unique VisDock namepace
var visdock = {};

// @@@@ these things should be in CSS stylesheets

var captured = [];
var num0 = 0;
var num = 0;
var annotationArray = [];
var numAnno = 0;
var Panel = {
	panel: null,
	panelArray: [],
	viewindex: 0,
	viewport: null,
	multiview: [],
	x: 0,
	xArray: [],
	y: 0,
	yArray: [],
	scale: 1,
	scaleArray: [],
	rotation: 0,
	rotationArray: [],
	zoomScale: 0.8,
	annotation: null,
	annotationArray: [],
	annotations: null,
	multiAnnotations: [],
	hostvis: null,
	multivis: [],
	width: 0,
	widthArray: [],
	height: 0,
	heightArray: [],

	init: function (svg, width, height) {
		// Create the main panel group
		this.panel = svg.append("g").attr("id", "MainPanel");
		this.width = width;
		this.height = height;

		// Define the viewport rectangle
		this.panel.append("rect")
		.attr("width", width)
		.attr("height", height).attr("style", "fill:none")
		.attr("class", "panel");
		this.panel.append("rect")
		.attr("width", width)
		.attr("height", height).attr("style", "opacity:0")
		.attr("class", "panel");

		var clipped = this.panel.append("g").attr("clip-path", "url(#panel)");

		var clip = this.panel.append("clipPath")
			.attr("id", "panel");

		clip
		.append("rect")
		.attr("width", width)
		.attr("height", height);

		// Create the viewport
		this.viewport = clipped.append("g")
			.attr("id", "VisDockViewPort");

		this.hostvis = this.viewport
			.append("g");

		this.annotation = this.viewport
			.append("g");
	}
};

var VisDock = {
	// VisDock elements
	dockspace: null,
	mode: null,
	svg: null,
	svgArray: [],
	svgWidth: 0,
	svgWidthArray: [],
	svgHeight: 0,
	svgHeightArray: [],
	captured: [],
	SelectShape: "polygon",
	color: ["red", "magenta", "orange", "yellow", "OliveDrab", "green", "DeepSkyBlue", "SlateBlue", "cyan", "dodgerblue", "lightseagreen"],
	opacity: "1",
	init_text: 0,
	query: [],
	birdtemp: [],
	birdclipped: [],
	dockOrient: 1,
	objects: [],
	searchLayers: [],
	responseScaleX: 1,
	responseScaleY: 1,
	eventHandler: null,
	multi_init: function (selector, number, masterNumber, width, height) {},
	init: function (selector, width, height) {

		if (!isNaN(width) && !isNaN(height)) {
			this.mode = "single";
			this.svg = d3.select(selector).append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("class", "svgVisDock");

			this.svgWidth = width;
			this.svgHeight = height;
			Panel.init(this.svg, width, height);

		} else if (width.length == undefined) {
			this.mode = "single";
			this.svg = d3.select(selector).append("svg")
				.attr("width", width.width)
				.attr("height", width.height)
				.attr("class", "svgVisDock");

			this.svgWidth = width.width;

			this.svgHeight = width.height;

			Panel.init(this.svg, this.svgWidth, this.svgHeight);
		} else {
			if (width.length == undefined) { // || width.length == 1){
				this.mode = "single";

				this.svg = d3.select(selector).append("svg")
					.attr("width", width.width)
					.attr("height", width.height)
					.attr("class", "svgVisDock");
				this.svgWidth = width.width;
				this.svgHeight = width.height;

				Panel.init(this.svg, this.svgWidth, this.svgHeight);
			} else if (width.length == 1) {
				this.mode = "single";

				this.svg = d3.select(selector).append("svg")
					.attr("width", width.width)
					.attr("height", width.height)
					.attr("class", "svgVisDock");
				this.svgWidth = width.width;
				this.svgHeight = width.height;

				Panel.init(this.svg, this.svgWidth, this.svgHeight);
			} else {
				for (var i = 0; i < width.length; i++) {
					var w0 = width[i].width;
					var h0 = width[i].height;
					var frame = selector;
					this.svgArray[i] = d3.select(frame)
						.append("svg")
						.attr("width", w0)
						.attr("height", h0)
						.attr("class", "svgVisDock")
						.attr("id", "svgVisDock" + i);
					this.mode = "multi";
					this.svgWidthArray[i] = w0;
					this.svgHeightArray[i] = h0;

					Panel.init(this.svgArray[i], w0, h0);

				}
			}

		}

		// Responsive Algorithm
		window.onresize = function () {
			if (VisDock.svgWidth > 3 * window.innerWidth || VisDock.svgHeight > 3 * window.innerHeight) {
				VisDock.responseScaleX = 1 / 2;
				VisDock.responseScaleY = 1 / 2;

			} else if (VisDock.svgWidth > 2 * window.innerWidth || VisDock.svgHeight > 2 * window.innerHeight) {

				VisDock.responseScaleX = 1 / 1.5;
				VisDock.responseScaleY = 1 / 1.5;

			} else if (VisDock.svgWidth > 1 * window.innerWidth || VisDock.svgHeight > 1 * window.innerHeight) {

				VisDock.responseScaleX = 1 / 1.2;
				VisDock.responseScaleY = 1 / 1.2;

			} else {

				VisDock.responseScaleX = 1;
				VisDock.responseScaleY = 1;

			}
		};
	},

	getViewport: function (n) {
		return Panel.hostvis;
	}

};
