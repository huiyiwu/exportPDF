$(function() {
	window.appRootDir = "PDFTest";
	document.addEventListener("deviceready", onDeviceReady, false);
	$('#exportPDF').click(function() {
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

var getImageFromUrl = function(url, callback) {
	var img = new Image, data, ret={data: null, pending: true};
	
	img.onError = function() {
		throw new Error('Cannot load image: "'+url+'"');
	}
	img.onload = function() {
		var canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		// Grab the image as a jpeg encoded in base64, but only the data
		data = canvas.toDataURL('image/jpeg');
		// Convert the data to binary form
		data = atob(data);
		document.body.removeChild(canvas);

		ret['data'] = data;
		ret['pending'] = false;
		if (typeof callback === 'function') {
			callback(data);
		}
	}
	img.src = url;

	return ret;
}

// Since images are loaded asyncronously, we must wait to create
// the pdf until we actually have the image data.
// If we already had the jpeg image binary data loaded into
// a string, we create the pdf without delay.
var createPDF = function(imgData) {
	var doc = new jsPDF();

	doc.addImage(imgData, 'JPEG', 10, 10, 50, 50);
	doc.addImage(imgData, 'JPEG', 70, 10, 100, 120);

	// Output as Data URI
	doc.output('datauri');
	doc.save("test.pdf");
}

exportPDF = function() {
	
//	getImageFromUrl('img/icon.jpg', createPDF);
	
	
	
	$('#customers').css("background-color","#FFFFFF");
	html2canvas($('#customers'),
	 {
                    dpi: 172,//导出pdf清晰度
                    onrendered: function (canvas) {
//                      var contentWidth = canvas.width;
//                      var contentHeight = canvas.height;
//
//                      //一页pdf显示html页面生成的canvas高度;
//                      var pageHeight = contentWidth / 592.28 * 841.89;
//                      //未生成pdf的html页面高度
//                      var leftHeight = contentHeight;
//                      //pdf页面偏移
//                      var position = 0;
//                      //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
//                      var imgWidth = 595.28;
//                      var imgHeight = 592.28 / contentWidth * contentHeight;

                        var pageData = canvas.toDataURL('image/png').slice('data:image/png;base64,'.length);
						var array = [];
						array[0] = pageData;
						cordova.exec(function(result) {
							console.log(result);
						}, null, 'ExportPdfPlugin', 'aa', array);
								
						
//						var fileTransfer = new FileTransfer();
//						var uri = encodeURI(pageData);
//						var filename = "test.png";
//						var filePath = window.appRootDir.fullPath + filename;
//						window.fileSystem.root.getFile(filePath,{
//								create: true
//							},function(fileEntry){
//							var targetURL = fileEntry.toURL();
//							fileTransfer.download(
//							uri,
//							targetURL,
//							function(entry){
//								
//								});
//						
//						var array = [];
//						array[0] = pageData;
//						cordova.exec(function(message) {
//
//						}, null, 'ExportPdfPlugin', 'doExport', array);
//						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						
						


////                      pageData = pageData.substring(pageData.indexOf(',') + 1);
//                      console.log(pageData);
////                      console.log(pageData.slice('data:image/jpeg;base64,'.length));
////                      window.location.href = pageData; // it will save locally
////						pageData = atob(pageData);





//                      console.log(pageData);
//                      var pdf = new jsPDF('p', 'pt');
////						pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight);
////                      //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
////                      //当内容未超过pdf一页显示的范围，无需分页
//                      if (leftHeight < pageHeight) {
//                          pdf.addImage(pageData, 'JPEG', 10, 10, imgWidth, imgHeight);
////							pdf.addImage(pageData, 'JPEG', 10, 10, 50, 50);
////							pdf.addImage(pageData, 'JPEG', 70, 10, 100, 120);
//                      } else {
//                          while (leftHeight > 0) {
//                              
//                              leftHeight -= pageHeight;
//                              position -= 841.89;
//                              //避免添加空白页
//                              if (leftHeight > 0) {
//                                  pdf.addPage();
//                              }
//                          }
//                      }
//                      pdf.save('test.pdf');
////                      var pdfOutput = pdf.output();
////							console.log(pdfOutput);
////							var filePath = window.appRootDir.fullPath + "test.pdf";
////							console.log(filePath)
////							window.fileSystem.root.getFile(filePath, {
////								create: true
////							}, function(entry) {
////								var fileEntry = entry;
////								console.log(entry);
////						
////								entry.createWriter(function(writer) {
////									writer.onwrite = function(evt) {
////										console.log("write success");
////									};
////						
////									console.log("writing to file");
////									writer.write(pdfOutput);
////								}, function(error) {
////									console.log(error);
////								});
////						
////							}, function(error) {
////								console.log(error);
////							});
                  },
                    //背景设为白色（默认为黑色）
                    background: "#fff" 
	 })
}