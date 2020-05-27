import words10KRaw from '../10000-words.txt';
const words10K = words10KRaw.split('\n');

import PerformanceReport from './components/PerformanceReport';
import Keyboard from './components/Keyboard';
import Display from './components/Display';
import dataStructureList from './data_structures/data_structure_list';
import { t9KeyCode } from './t9';

document.addEventListener("DOMContentLoaded", () => {
  const keyboardElement = document.querySelector('.keyboard');
  const keyboard = new Keyboard(keyboardElement);
  const display = new Display(
    keyboard.keyPressObservable,
    new dataStructureList.Trie(words10K, t9KeyCode)
  );
  
  Object.keys(dataStructureList).forEach(dataStructure => {
    new PerformanceReport(dataStructure);
  });
});
