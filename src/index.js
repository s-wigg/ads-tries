import keyboardButtons from './keyboard_buttons';
import * as rxjs from 'rxjs';
import { map, scan } from 'rxjs/operators'

import words10KRaw from '../10000-words.txt';
const words10K = words10KRaw.split('\n');


import WordList from './data_structures/word_list';
import profile from './performance';
import { MESSAGE_TYPES, TASK_TYPES } from './messages';
import dataStructureList from './data_structures/data_structure_list';


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

  // console.log(profile(WordList));
  const perfReport = new PerformanceReport(WordList);
  // perfReport.startRun();
});

const loadTemplate = (name) => {
  const selector = `.template--${name}`;
  const template = document.querySelector(selector);

  if (!template) {
    throw new Error(`Could not load template - query for selector ${selector} returned nothing`);
  }

  return template.content.cloneNode(true);
}

class PerformanceReport {
  constructor(dataStructure) {
    this.tasks = [];

    const title = dataStructureList.wordList.name;
    this.element = this.buildElement(title);
    this.worker = this.initializeWorker();

    const taskId = this.tasks.length;
    this.worker.postMessage({
      type: MESSAGE_TYPES.NEW_TASK,
      payload: {
        type: TASK_TYPES.INITIALIZE,
        id: taskId,
        dictionarySize: 10000,
        dataStructure: 'wordList',
      }
    })
  }

  buildElement(title) {
    const report = loadTemplate('performance-report');
    const element = report.firstElementChild;

    report.querySelector('.performance-report--title').textContent = title;

    const reportList = document.querySelector('.performance--report-list');
    reportList.appendChild(report);

    return element;
  }

  initializeWorker() {
    const worker = new Worker('./perfrunner.worker.js', { type: 'module' });
    worker.addEventListener('message', (message) => {
      console.log('host received message');
      console.log(message.data);
    });

    return worker;
  }

  // startRun() {
  //   console.log(worker);

    

  //   console.log('host posting start');
  //   worker.postMessage('start');
  //   console.log('host posted start');

  //   console.log('host posting finish');
  //   worker.postMessage('finish');
  //   console.log('host posted finish');

  //   // worker.terminate();
  // }
}

class PerformanceRun {

}

const buildPerformanceReport = (DataStructure) => {



}




