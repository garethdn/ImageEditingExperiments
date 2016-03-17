(() => {
  
  let canvas = document.getElementById('original-canvas');
  let newCanvas = document.getElementById('new-canvas');
  let img = new Image();
  let halfWidth;


  newCanvas.getContext('2d').mozImageSmoothingEnabled = false;
  newCanvas.getContext('2d').imageSmoothingEnabled = false; //future

  img.onload = () => onImageLoad(img);
  img.src = 'src/images/bo.jpg';

  let onImageLoad = (img) => {
    setCanvasDimensions(img.width, img.height);
    drawImage(canvas, img);
  }

  let onFileSelect = (e) => {
    let reader = new FileReader();

    reader.onload = (event) => {
        // img.onload = () => onImageLoad(img);
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]); 
  }
  document.getElementById('image-file').addEventListener('change', onFileSelect)

  let render = () => {
    var shape = document.getElementById('shape-type').value;
    halfWidth = document.getElementById('shape-size').value ?  
      +document.getElementById('shape-size').value : 
      10;

    clean();
    drawShapes(shape);
  }
  document.getElementById('submit').addEventListener("click", render);

  let clean = () => {
    newCanvas.getContext('2d').clearRect(0, 0, newCanvas.width, newCanvas.height);
  }

  let setCanvasDimensions = (width, height) => {
    canvas.width = width;
    canvas.height = height;

    newCanvas.width = width;
    newCanvas.height = height;
  }

  let drawImage = (canvas, img) => {
    canvas.getContext('2d').drawImage(img, 0, 0);
  }

  let drawShapes = (shapeType) => {
    let originalCanvasContext = canvas.getContext('2d');
    let newCanvasContext = newCanvas.getContext('2d');

    let startTime = new Date().getTime();
    let counter = 0;

    for (var x = halfWidth; x <= (canvas.width - halfWidth); x += (halfWidth * 2) ) {

      for (var y = halfWidth; y <= (canvas.height - halfWidth); y += (halfWidth *2) ) {

        let pixelData = originalCanvasContext.getImageData(x, y, 1, 1).data;

        shapeType === 'circle' ?
          drawCircle(newCanvasContext, x, y, `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`) :
          drawSquare(newCanvasContext, x, y, `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`)

        counter++;
      }

    };

    document.getElementById('total-time').innerHTML = (new Date().getTime() - startTime) / (1000) + ' seconds';
    document.getElementById('total-loops').innerHTML = counter + ' loop iterations';
  }

  let drawSquare = (context, x, y, color) => {
    context.beginPath();
    context.rect(x - halfWidth, y - halfWidth, (halfWidth*2), (halfWidth*2));
    context.fillStyle = color;
    context.fill();
  }

  let drawCircle = (context, x, y, color) => {
    context.beginPath();
    context.arc(x, y, halfWidth, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
  }
 
})()