



import words10KRaw from '../10000-words.txt';
const words10K = words10KRaw.split('\n');


import WordList from './data_structures/word_list';
import profile from './performance';

import PerformanceReport from './components/PerformanceReport';
import Keyboard from './components/Keyboard';
import Display from './components/Display';

document.addEventListener("DOMContentLoaded", () => {
  const keyboardElement = document.querySelector('.keyboard');
  const keyboard = new Keyboard(keyboardElement);
  const display = new Display(keyboard.keyPressObservable);
  
  // console.log(profile(WordList));
  const perfReport = new PerformanceReport(WordList);
  // perfReport.startRun();
});
