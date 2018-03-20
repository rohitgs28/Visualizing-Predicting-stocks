var mainElement = document.getElementsByTagName("html")[0];
VisDock.init("#svgDiv", {
	width: mainElement.clientWidth,
	height: mainElement.clientHeight
});
var viewport = VisDock.getViewport();
