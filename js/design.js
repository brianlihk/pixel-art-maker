// Set variables
let artboard = $('#art-board');
let createArtBoard = $('#submit');
let rows = $('#rows');
let columns = $('#columns');
let color = $('#color');
let colorLable = $('#colorLable');
let brush = $('#brush');
let clear = $('#clear');
let eraser = $('#remove-color');
let bucket = $('#fill');

// TODO: Set r and c to 0 as initial values
let r = 0;
let c = 0;
// TODO: Set action to null
let action = null;

function uploadImage(src, name){
    sendBase64ToServer(name, src);
};

function sendBase64ToServer (name, base64){
	console.log("uploading")
    var httpPost = new XMLHttpRequest(),
        path = "upload.php",
        data = JSON.stringify({image: base64});
		httpPost.onreadystatechange = function(err) {
            if (httpPost.readyState == 4 && httpPost.status == 200){
				swal({
					title: "Congratulations!",
					text: "You made youself a pixel art for NFT!",
					icon: httpPost.responseText,
				});
            } else {
                console.error(err);
            }
        };
    // Set the content type of the request to json since that's what's being sent
    httpPost.open("POST", path, true);
    httpPost.setRequestHeader('Content-Type', 'application/json');
    httpPost.send(data);
};

/**
* @description Create art board grid
* @listens click
* @fires makeGrid - The callback that handles the event to do
*/
// createArtBoard.addEventListener('click', makeGrid);
createArtBoard.click(function(e) {
    makeGrid();
    e.preventDefault();
});

$('#color').on('change',
    function() {
        document.getElementById('color').style.backgroundColor = $("#color").val()
    }
);
/**
* @description Clears art board
* @listens click
* @fires clearArtBoard - The callback that handles the event to do
*/
clear.click(clearArtBoard);

/**
* @description Fills art board
* @listens click
*/
bucket.click(function() {
    /**
    * @listens click listens to a click on the artboard
    * @fires fillArtBoard - The callback that handles the event to do
    */
    artboard.click(fillArtBoard);
});

// TODO: Check if brush element is checked
if (brush.prop('checked')) {
    /**
    * @description Call function clickAndDrag
    * @param {callback} paint - The callback function to paint
    */
    // TODO: Call function to paint
    clickAndDrag(paint);
}

/**
* @description Fills color to cells using click and drag
* @listens click
* @fires clickAndDrag
* @param {callback} paint - The callback to paint
*/
brush.click(clickAndDrag(paint));

/**
* @description Removes color from cells using click and drag
* @listens click
* @fires clickAndDrag
* @param {callback} erase - The callback to erase
*/
eraser.click(clickAndDrag(erase));

/**
* @description Action to be performed on click and drag on artboard area
* @callback clickAndDrag
* @param {callback} func1 - placeholder for callback function paint or erase
*/
function clickAndDrag(func1) {
    /**
    * @listens click
    * @param {event} e 
    */
    artboard.on('click', function(e) {
        // TODO: Apply callback if class name and action match
        if (e.target.className === 'pixel' && action === null) {
            func1(e);
        }
    });
    /**
    * @listens mousedown
    */
    artboard.mousedown(function() {
        // TODO: Set action to click
        action = 'click';
    });
    /**
    * @listens mousemove
    * @param {event} e
    */
    artboard.mousemove(function(e) {
        // TODO: Check if action is set to click
        if (action === 'click') {
            // TODO: Set action to drag
            action = 'drag';
        }
        // TODO: Apply callback if class name and action match
        if (e.target.className === 'pixel' && action === 'drag') {
            func1(e);
        }
    });
    /**
    * @listens mouseup
    */
    artboard.mouseup(function() {
        // TODO: Check if class name and action match
        if (action === 'drag' || action === 'click') {
            // TODO: Set action back to null
            action = null;
        }
    });
}

/**
* @callback paint
* @description Fills color when the action is null
* @param {MouseEvent} e
*/
function paint(e) {
    // TODO: If brush is checked apply color
    if (brush.prop('checked')) {
        $(e.target).css('background', color.val());
    }
}

/**
* @callback erase
* @description Removes color when the action is null
* @param {MouseEvent} e
*/
function erase(e) {
    // TODO: If eraser is checked set color to transparent
    if (eraser.prop('checked')) {
        $(e.target).css('background', 'transparent');
    }
}

/**
* @description Fills entire artboard with selected color
*/
function fillArtBoard() {
    let pixelClass = $('.pixel');
    // TODO: If brush is checked and action is set to null, apply color value
    if (bucket.prop('checked') && action === null) {
        pixelClass.css('background', color.val());
    }
}

/**
* @description Clears artboard
*/
function clearArtBoard() {
    let pixelClass = $('.pixel');
    pixelClass.css('background', 'transparent');
}

/**
* @description Creates grid
*/
function makeGrid() {
    let w = artboard.innerWidth();
    let size = 0;
    // TODO: Set values from input to r and c
    r = rows[0].valueAsNumber;
    c = columns[0].valueAsNumber;
    size = (100/c)/1.1 + '%';
    // TODO: Validate values for r and c
    if (r < 1 || r > 100 || c < 1 || c > 100) {
        alert("Please enter a number between 1 and 100");
    } else {
        // TODO: Set/create elements
        artboard.html('');
        let grid = $('<table id="artTable"></table>');
        grid.appendTo(artboard);
        grid.css({'margin': '0 auto', 'border-collapse': 'collapse', 'border-spacing': '0', 'width': '100%'});
        for (let i = 0; i < r; i++) {
            // TODO: Create rows
            let row = $('<tr></tr>');
            row.appendTo(grid);
            let cell = $('td');
            for (let j = 0; j < c; j++) {
                // TODO: Create column elements
                let pixel = $('<td></td>');
                row.append(pixel);
                pixel.addClass('pixel');
                pixel.css({'border': '1px solid rgba(189, 189, 189,1.0)',  'background': 'transparent', 'box-sizing': 'border-box',  'padding-top': size });
            }
        }
    }
}

function renderImage(){
	let Arows = document.getElementById("artTable").rows;
	Arows = Array.from(Arows)
	let data = [];
	Arows.forEach(element => {
		let row = [];
		Array.from(element.cells).forEach(item => {
			let rgb = item.style.background;
			if(rgb == "transparent"){
				row.push([255,255,255,0]);
			}else{
				rgb = rgb.slice(4, -1).replace(" ", "").split(",")
				rgb.push(255)
				row.push(rgb)
			}
		});
		data.push(row);
	});
	
	var width = c,
    height = r,
    buffer = new Uint8ClampedArray(width * height * 4); // have enough bytes
	for(var y = 0; y < height; y++) {
		for(var x = 0; x < width; x++) {
			var pos = (y * width + x) * 4; // position in buffer based on x and y
			buffer[pos  ] = data[y][x][0];           // some R value [0, 255]
			buffer[pos+1] = data[y][x][1];           // some G value
			buffer[pos+2] = data[y][x][2];           // some B value
			buffer[pos+3] = data[y][x][3];           // set alpha channel
		}
	}
	var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;

	// create imageData object
	var idata = ctx.createImageData(width, height);
	
	// set our buffer as source
	idata.data.set(buffer);

	// update canvas with new data
	ctx.putImageData(idata, 0, 0);
	
	var dataUri = canvas.toDataURL('image/png');
	
	uploadImage(dataUri, 'test.png')
	downloadURI(dataUri, "Your NFT iamge.png")
}

function listProp(obj){
	for(var m in obj) {
		console.log(typeof m, m)
	}
	// console.log(element.cells)
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}
function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}





window.onload = function() {
    makeGrid();
};