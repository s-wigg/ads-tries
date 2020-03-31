import keyboardButtons from './keyboard_buttons';
import { loadTemplate } from './util';

import * as rxjs from 'rxjs';
import { map } from 'rxjs/operators';

class Keyboard {
  constructor(element) {
    this.element = element;
    const buttonTemplate = loadTemplate('keyboard-button', false);

    this.keyPressObservable = this.buildKeys(this.element, buttonTemplate);
  }

  buildKeys(keyboardContainer, buttonTemplate) {
    const observables = keyboardButtons.map(button => {
      const buttonFragment = buttonTemplate.content.cloneNode(true);
      const element = buttonFragment.firstElementChild;
  
      element.querySelector('.keyboard-button--number').textContent = button.number;
      element.querySelector('.keyboard-button--subtext').textContent = button.subtext;
  
      keyboardContainer.appendChild(element);
  
      return rxjs.fromEvent(element, 'click').pipe(map(() => button.number))
    });
  
    return rxjs.merge(...observables);
  }
}

export default Keyboard;