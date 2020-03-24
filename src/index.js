import keyboardButtons from './keyboard_buttons';
import * as rxjs from 'rxjs';
import { map, scan } from 'rxjs/operators'

const buildKeyboard = (keyboardContainer, buttonTemplate) => {
  const observables = keyboardButtons.map(button => {
    const buttonFragment = buttonTemplate.content.cloneNode(true);
    const element = buttonFragment.firstElementChild;

    element.querySelector('.keyboard-button--number').textContent = button.number;
    element.querySelector('.keyboard-button--subtext').textContent = button.subtext;

    keyboardContainer.appendChild(element);

    return rxjs.fromEvent(element, 'click').pipe(map(() => button.number))
  });

  return rxjs.merge(...observables);
};



document.addEventListener("DOMContentLoaded", () => {

  const keyboard = document.querySelector('.keyboard');
  const buttonTemplate = document.querySelector('.template--keyboard-button');

  const keyPressObservable = buildKeyboard(keyboard, buttonTemplate);

  const numberDisplay = document.querySelector('.display--numbers');
  keyPressObservable.pipe(
    scan((value, key) => {
      if (key === '#') {
        return value.slice(0, -1);
      }
      return value + key;
    }, ''),
  ).subscribe(value => numberDisplay.value = value);
});