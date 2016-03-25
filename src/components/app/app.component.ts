import {ViewComponent} from '../common/view.component';
import {ImageService} from '../common/image.service';
import {EditorComponent} from '../editor/EditorComponent';

export class AppComponent extends ViewComponent {

  public title:string = 'Image Editor';
  public shapeSize:number = 5;
  public shapeType:string = 'ascii';
  public color:string = 'original';
  public bwThreshold:string = '50';
  public imgSrc:string;
  public events = { 
    'click #submit'                       : 'onSubmit',
    'change #shape-size'                  : 'onChangeShapeSize',
    'change #shape-type'                  : 'onChangeShapeType',
    'change #image-file'                  : 'onFileSelect',
    'change [name="bandw-threshold"]'     : 'onChangeBWThreshold',
    'click [name="color"]'                : 'onChangeColor'
  };
  private _imgService:ImageService;
  private _fileReader:FileReader;

  constructor(options) {
    super(options);

    this._imgService = new ImageService();
    this._fileReader = new FileReader();

    this._fileReader.onload = (event) => this.onFileReaderLoad(event);
  }

  getTemplate() {
    return `
      <h1>${this.title}</h1>
      <div id="app-container">
        <form id="settings">
          <label for="shape-size">Shape size: </label>
          <input type="number" 
            min=1 
            max=100 
            id="shape-size" 
            value="${this.shapeSize}">

          <label for="shape-type">Shape type: </label>
          <select name="shape-type" id="shape-type">
            <option value="circle">Circle</option>
            <option value="triangle">Triangle</option>
            <option value="square">Square</option>
            <option value="hexagon">Hexagon</option>
            <option value="ascii" selected>ASCII</option>
          </select>

          <label for="image-file">Image: </label>
          <input type="file" id="image-file" accept="image/*">

          <button id="submit">Do it</button>

          <div>
            <label for="color">Color: </label>
            <input type="radio" name="color" value="original" checked>Original
            <input type="radio" name="color" value="grayscale">Grayscale
            <input type="radio" name="color" value="bandw">Black + White

            <label for="bandw-threshold"></label>
            <input type="number" min=5 max=90 name="bandw-threshold" id="bandw-threshold" step=5 value="${this.bwThreshold}">
          </div>

        </form>
      </div>

      <canvas id="original-canvas"></canvas>
      <canvas id="new-canvas"></canvas>

      <pre id="ascii-output"></pre>
    `
  }

  onSubmit(e:Event) {
    e.preventDefault();

    this.drawImage().then(() => {
      this.shapeType === 'ascii' ? 
        this.getAsciiRepresentation() :
        this.transformImage();
    });
  }

  getAsciiRepresentation(){
    this.el.querySelector('#ascii-output').innerHTML = this._imgService.getAsciiRepresentation(this.getFromCanvas(), this.getToCanvas(), this.getTranformationOptions())
  }

  transformImage() {
    this._imgService.transform(this.getFromCanvas(), this.getToCanvas(), this.getTranformationOptions());
  }

  getFromCanvas() {
    return <HTMLCanvasElement>this.el.querySelector('#original-canvas');
  }

  getToCanvas() {
    return <HTMLCanvasElement>this.el.querySelector('#new-canvas');
  }

  getTranformationOptions() {
    return { 
      shapeSize: this.shapeSize, 
      shapeType: this.shapeType, 
      color: this.color,
      bwThreshold: this.bwThreshold
    }
  }

  drawImage() {
    return this._imgService.drawImage(<HTMLCanvasElement>this.el.querySelector('#original-canvas'), this.imgSrc);
  }

  onChangeShapeSize(e) {
    this.shapeSize = +e.currentTarget.value;
  }

  onChangeShapeType(e) {
    this.shapeType = e.currentTarget.value;
  }

  onChangeColor(e) {
    this.color = e.currentTarget.value;
  }

  onChangeBWThreshold(e) {
    this.bwThreshold = e.currentTarget.value;
  }

  onFileReaderLoad(event) {
    this.imgSrc = event.target['result'];
    this.drawImage();
  }

  onFileSelect(e) {
    this._fileReader.readAsDataURL(e.target.files[0]); 
  }

}