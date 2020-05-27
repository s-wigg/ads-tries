import words10KRaw from '../10000-words.txt';
const words10K = words10KRaw.split('\n');

import WordList from './data_structures/word_list';
import Trie from './data_structures/trie';

import profile from './performance';

import PerformanceReport from './components/PerformanceReport';
import Keyboard from './components/Keyboard';
import Display from './components/Display';
import { t9KeyCode } from './t9';

document.addEventListener("DOMContentLoaded", () => {
  const keyboardElement = document.querySelector('.keyboard');
  const keyboard = new Keyboard(keyboardElement);
  const display = new Display(keyboard.keyPressObservable, new Trie(words10K, t9KeyCode));
  
  // console.log(profile(WordList));
  const wlReport = new PerformanceReport(WordList);
  const tireReport = new PerformanceReport(Trie);
  wlReport.startRun();
  trieReport.startRun();
});
