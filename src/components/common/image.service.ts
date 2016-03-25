import * as AppConstants from '../app/app.constants';

let instance = null;

export class ImageService {  

  public originalCanvas:HTMLCanvasElement;
  public newCanvas:HTMLCanvasElement;
  public defaultImgSrc:string = 'src/images/bo.jpg';

  public charCache:string = '';
  public currAsciiRow:number = 0;

  constructor() {

    if(!instance) {
      instance = this;
    }

    this._initialize();

    return instance;
  }

  private _initialize() {}

  drawImage(canvas:HTMLCanvasElement, src:string = this.defaultImgSrc):Promise<any> {
    let canvasRendered = new Promise((resolve, reject) => {

      let img:HTMLImageElement = new Image();
      img.onload = () => this._onImageLoad(canvas, img, resolve);
      img.src = src;

    })

    return canvasRendered;
  }

  private _onImageLoad(canvas:HTMLCanvasElement, img:HTMLImageElement, promiseResolver) {
    this._setCanvasDimensions(canvas, img.width, img.height);
    canvas.getContext('2d').drawImage(img, 0, 0);
    promiseResolver('loaded')
  }

  private _setCanvasDimensions(canvas:HTMLCanvasElement, width, height) {
    canvas.height = height;
    canvas.width = width;
  }

  clearCanvas(canvas:HTMLCanvasElement) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  }

  transform(fromCanvas:HTMLCanvasElement, toCanvas:HTMLCanvasElement, options?) {
    this._setCanvasDimensions(toCanvas, fromCanvas.width, fromCanvas.height);

    let fromCtx = fromCanvas.getContext('2d');
    let toCtx = toCanvas.getContext('2d');

    for (var y = options.shapeSize; y <= (fromCanvas.height - options.shapeSize); y += (options.shapeSize *2) ) {

      for (var x = options.shapeSize; x <= (fromCanvas.width - options.shapeSize); x += (options.shapeSize * 2) ) {

        let pixelData = fromCtx.getImageData(x, y, 1, 1).data;

        switch(options.shapeType) {

          case 'circle':
            this.drawCircle(toCtx, x, y, options.shapeSize, this.getColor(pixelData, options));
            break;

          case 'square':
            this.drawPolygon(toCtx, x, y, options.shapeSize, 4, this.getColor(pixelData, options))
            break;

          case 'triangle':
            this.drawPolygon(toCtx, x, y, options.shapeSize, 3, this.getColor(pixelData, options))
            break;

          case 'hexagon':
            this.drawPolygon(toCtx, x, y, options.shapeSize, 6, this.getColor(pixelData, options))
            break;
        }

      }

    }

  }

  drawCircle(ctx, x, y, r, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  drawPolygon(ctx, x, y, r, sides, fill) {
    var angle;

    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
        angle = i * 2 * Math.PI / sides - Math.PI / 2;
        ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle));
    }

    ctx.fillStyle = fill;
    ctx.fill();
  }

  getAsciiRepresentation(fromCanvas:HTMLCanvasElement, toCanvas:HTMLCanvasElement, options) {
    this.charCache = '';
    this.currAsciiRow = 0;

    let fromCtx = fromCanvas.getContext('2d');
    let toCtx = toCanvas.getContext('2d');

    for (var y = options.shapeSize; y <= (fromCanvas.height - options.shapeSize); y += (options.shapeSize * 2 + options.shapeSize * 2) ) {

      for (var x = options.shapeSize; x <= (fromCanvas.width - options.shapeSize); x += (options.shapeSize * 2) ) {

        let pixelData = fromCtx.getImageData(x, y, 1, 1).data;
        this.drawAsciiChar(toCtx, x, y, Math.floor((pixelData[0] + pixelData[1] + pixelData[2])/3));

      }

    }
    return this.charCache;
  }

  drawAsciiChar = (ctx, x, y, color) => {
    if (y > this.currAsciiRow) {
      this.currAsciiRow = y;
      this.charCache += '<br>';
    }

    this.charCache += AppConstants.ASCII_GRAYSCALE_MAP_DARK_TO_LIGHT[Math.round( color ? (color/255) * 9 : 0)];
  };

  getColor(pixelData, options) {
    if (options.color === 'original') {
      return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
    }

    if (options.color === 'grayscale') {
      let value = Math.floor((pixelData[0] + pixelData[1] + pixelData[2])/3);

      return `rgb(${value}, ${value}, ${value})`;
    }

    if (options.color === 'bandw') {
      let value = Math.floor((pixelData[0] + pixelData[1] + pixelData[2]) / 3);

      return value > 255 * (options.bwThreshold / 100) ?
        `rgb(255, 255, 255)`:
        `rgb(0,0,0)`;
    }
  }

}