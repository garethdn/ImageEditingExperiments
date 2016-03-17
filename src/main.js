(() => {
  
  let canvas = document.getElementById('original-canvas');
  let newCanvas = document.getElementById('new-canvas');
  let img = new Image();
  let halfWidth;
  let colorType;
  let bandwThreshold;

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
    document.getElementById('total-time').innerHTML = '...working';
    document.getElementById('total-loops').innerHTML = '...working';


    var shape = document.getElementById('shape-type').value;
    colorType = document.getElementById('colors').elements['color'].value;
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

        switch(shapeType) {

          case 'circle':
            drawCircle(newCanvasContext, x, y, getColor(pixelData));
            break;

          case 'square':
            drawSquare(newCanvasContext, x, y, getColor(pixelData));
            break;

          case 'triangle':
            polygon(newCanvasContext, x, y, 3, halfWidth, halfWidth, 0, getColor(pixelData));
            break;

          case 'hexagon':
            polygon(newCanvasContext, x, y, 6, halfWidth, halfWidth, 0, getColor(pixelData));
            break;

        }

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

  let getColor = (pixelData) => {
    if (colorType === 'original') {
      return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
    }

    if (colorType === 'grayscale') {
      let value = Math.floor((pixelData[0] + pixelData[1] + pixelData[2])/3);

      return `rgb(${value}, ${value}, ${value})`;
    }

    if (colorType === 'bandw') {
      let value = Math.floor((pixelData[0] + pixelData[1] + pixelData[2]) / 3);
      let threshold = document.getElementById('bandw-threshold').value || 50;

      return value > 255 * (threshold / 100) ?
        `rgb(255, 255, 255)`:
        `rgb(0,0,0)`;
    }
  }

  let polygon = (ctx, x, y, points, radius1, radius2, alpha0, color) => {
    //points: number of points (or number of sides for polygons)
    //radius1: "outer" radius of the star
    //radius2: "inner" radius of the star (if equal to radius1, a polygon is drawn)
    //angle0: initial angle (clockwise), by default, stars and polygons are 'pointing' up
    var i, angle, radius;
    if (radius2 !== radius1) {
        points = 2 * points;
    }
    ctx.beginPath();
    for (i = 0; i <= points; i++) {
        angle = i * 2 * Math.PI / points - Math.PI / 2 + alpha0;
        radius = i % 2 === 0 ? radius1 : radius2;
        ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    }

    ctx.fillStyle = color;
    ctx.fill();
}
 
})()