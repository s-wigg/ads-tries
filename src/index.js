import keyboardButtons from './keyboard_buttons';
import * as rxjs from 'rxjs';
import { map, scan } from 'rxjs/operators'

import words10KRaw from '../10000-words.txt';
const words10K = words10KRaw.split('\n');


import WordList from './data_structures/word_list';
import profile from './performance';

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
  const keyCodeStream = keyPressObservable.pipe(
    scan((value, key) => {
      if (key === '#') {
        return value.slice(0, -1);
      }
      return value + key;
    }, ''),
  );
  
  keyCodeStream.subscribe(value => numberDisplay.value = value);

  const dataStructures = {
    wordList: new WordList(words10K),
  };
  let selectedDataStructure = dataStructures.wordList;

  const wordsDisplay = document.querySelector('.display--words');
  keyCodeStream.subscribe(value => {
    const possibleWords = selectedDataStructure.lookupPrefix(value);
    wordsDisplay.value = possibleWords.slice(0, 5).join(', ');
  });

  console.log(profile(WordList));
});




