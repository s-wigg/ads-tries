

import { scan } from 'rxjs/operators';

import words10KRaw from '../10000-words.txt';
const words10K = words10KRaw.split('\n');


import WordList from './data_structures/word_list';
import profile from './performance';

import PerformanceReport from './components/PerformanceReport';
import Keyboard from './components/Keyboard';



document.addEventListener("DOMContentLoaded", () => {
  const keyboardElement = document.querySelector('.keyboard');

  console.log(Keyboard);
  const keyboard = new Keyboard(keyboardElement);

  const numberDisplay = document.querySelector('.display--numbers');
  const keyCodeStream = keyboard.keyPressObservable.pipe(
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

  // console.log(profile(WordList));
  const perfReport = new PerformanceReport(WordList);
  // perfReport.startRun();
});
