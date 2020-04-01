import words10KRaw from '../10000-words.txt';
const words10K = words10KRaw.split('\n');

import WordList from './data_structures/word_list';

import PerformanceReport from './components/PerformanceReport';
import Keyboard from './components/Keyboard';
import Display from './components/Display';
import dataStructureList from './data_structures/data_structure_list';

document.addEventListener("DOMContentLoaded", () => {
  const keyboardElement = document.querySelector('.keyboard');
  const keyboard = new Keyboard(keyboardElement);
  const display = new Display(keyboard.keyPressObservable, new WordList(words10K));
  
  Object.keys(dataStructureList).forEach(dataStructure => {
    new PerformanceReport(dataStructure);
  });
});
