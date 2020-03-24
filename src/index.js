import keyboardButtons from './keyboard_buttons';
import * as rxjs from 'rxjs';
import { map } from 'rxjs/operators'

const buildKeyboard = (keyboardContainer, buttonTemplate) => {
  const observables = [];
  keyboardButtons.forEach(button => {
    const buttonElem = buttonTemplate.content.cloneNode(true);

    buttonElem.querySelector('.keyboard-button--number').textContent = button.number;
    buttonElem.querySelector('.keyboard-button--subtext').textContent = button.subtext;

    observables.push(
      rxjs.fromEvent(buttonElem.firstElementChild, 'click')
        .pipe(map(() => button.number)) //.subscribe((x) => console.log(`click ${x}`))
    );

    keyboardContainer.appendChild(buttonElem);
  });

  return rxjs.merge(...observables);
};



document.addEventListener("DOMContentLoaded", () => {
  
  const keyboard = document.querySelector('.keyboard');
  const buttonTemplate = document.querySelector('.template--keyboard-button');
  
  const keyPressObservable = buildKeyboard(keyboard, buttonTemplate);
  
  const numberDisplay = document.querySelector('.display--numbers');
  keyPressObservable.subscribe(number => {
    console.log(`${number} key pressed`);
    numberDisplay.value += number;
  })
});