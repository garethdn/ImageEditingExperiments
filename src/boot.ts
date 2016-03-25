import {AppComponent} from './components/app/app.component.ts';

let appComponent = new AppComponent({
  el: document.getElementById('shell')
});
appComponent.render();