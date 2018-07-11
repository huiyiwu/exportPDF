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
exportPDF = function() {
	var myTable = $(".table");
	// 获取title
	var tableThs = myTable.find("thead th");
	//获取每个tr
	var tableTrs = myTable.find("tbody tr");
	var columns = [];
	//处理title数组
	tableThs.each(function() {
		columns.push({
			title: $(this).text(),
			key: $(this).text()
		});
	});
	//处理数据数组
	var data = [];
	tableTrs.each(function() {
		var tds = $(this).children();
		var object = {};
		//生成数据对象
		$.each(columns, function(i, r) {
			var tdTitle = columns[i].key;
			//'object'跟上文对象名称一致，动态件加属性和值
			eval('object.' + tdTitle + '="' + $(tds).eq(i).text() + '"');
		});
		data.push(object);
	});

	console.log("generating pdf...");
	var doc = new jsPDF();

	doc.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');
	//pdf标题设置
	doc.setFont('NotoSansCJKjp');
	doc.setFontType("normal");
	//doc.autoTable(columns, data, {});
	// https://github.com/simonbengtsson/jsPDF-AutoTable 主要属性参考
	doc.autoTable(columns, data, {
		styles: {
			cellPadding: 0.5,
			fontSize: 8,
			font: "NotoSansCJKtc"
		}
	});

	var pdfOutput = doc.output();
	console.log(pdfOutput);
	var filePath = window.appRootDir.fullPath + "test.pdf";
	console.log(filePath)
	window.fileSystem.root.getFile(filePath, {
		create: true
	}, function(entry) {
		var fileEntry = entry;
		console.log(entry);

		entry.createWriter(function(writer) {
			writer.onwrite = function(evt) {
				console.log("write success");
			};

			console.log("writing to file");
			writer.write(pdfOutput);
		}, function(error) {
			console.log(error);
		});

	}, function(error) {
		console.log(error);
	});
}