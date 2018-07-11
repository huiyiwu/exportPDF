$(function(){
	window.appRootDir = "PDFTest";
	document.addEventListener("deviceready", onDeviceReady, false);
	$('#exportPDF').click(function(){
		exportPDF();
	})
})
onDeviceReady = function() {
	console.log("device is ready");
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
		function(fileSystem) {
			console.log("filesystem got");
			window.fileSystem = fileSystem;
			fileSystem.root.getDirectory(window.appRootDir, {
				create: true,
				exclusive: false
			}, function(entry) {
				window.appRootDir = entry;
				console.log("application dir is ready");
			}, function() {
				console.log("failed to get filesystem");
			});
		},
		function() {
			console.log("failed to get filesystem");
		});
}
exportPDF = function(){
	console.log("generating pdf...");
	var doc = new jsPDF('p', 'pt');
	
	
	doc.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');
	//pdf标题设置
	doc.setFont('NotoSansCJKjp');
	doc.setFontType("normal");
	
	var specialElementHandlers = {
	    '#customers': function(element, renderer){
	        return true;
	    }
	};
	// All units are in the set measurement for the document
	// This can be changed to "pt" (points), "mm" (Default), "cm", "in"
	doc.fromHTML($('#customers').get(0), 15, 15, {
	    'width': 170,
	    'elementHandlers': specialElementHandlers
	});
	
	var pdfOutput = doc.output();
	console.log( pdfOutput );
	console.log(window.fileSystem.name);
   console.log(window.fileSystem.root.name);
   console.log(window.fileSystem.root.fullPath);
   var filePath = window.appRootDir.fullPath + "test.pdf";
   console.log(filePath)
	window.fileSystem.root.getFile(filePath, {create: true}, function(entry) {
      var fileEntry = entry;
      console.log(entry);

      entry.createWriter(function(writer) {
         writer.onwrite = function(evt) {
         console.log("write success");
      };

      console.log("writing to file");
         writer.write( pdfOutput );
      }, function(error) {
         console.log(error);
      });

   }, function(error){
      console.log(error);
   });
}
