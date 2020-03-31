import keyboardButtons from './keyboard_buttons';
import * as rxjs from 'rxjs';
import { map, scan } from 'rxjs/operators';
import prettyBytes from 'pretty-bytes';

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

    console.log(this.worker);

    this.launchTask({
      title: 'load 10k words',
      type: TASK_TYPES.INITIALIZE,
      dictionarySize: 10000,
      dataStructure: 'wordList',
    });
  }

  buildElement(title) {
    const report = loadTemplate('performance-report');
    const element = report.firstElementChild;

    report.querySelector('.performance-report--title').textContent = title;

    const reportList = document.querySelector('.performance--report-list');
    reportList.appendChild(report);

    console.log(element);

    return element;
  }

  initializeWorker() {
    console.log("initializing worker");
    const worker = new Worker('./perfrunner.worker.js', { type: 'module' });

    worker.addEventListener('message', (event) => {
      const message = event.data;
      console.log('host got message from worker:');
      console.log(message);
      switch (message.type) {
        case MESSAGE_TYPES.TASK_UPDATE:
          this.updateTask(message.payload.id, message.payload);
          break;

        case MESSAGE_TYPES.TASK_COMPLETE:
          this.completeTask(message.payload.id, message.payload);
          break;

        default:
          console.log('host received unknown message from worker');
          console.log(message);
      }
    });

    return worker;
  }

  launchTask(task) {
    console.log('launching task')
    const taskId = this.tasks.length;
    task.id = taskId;

    this.tasks.push(task);

    this.worker.postMessage({
      type: MESSAGE_TYPES.NEW_TASK,
      payload: task,
    });

    task.component = new TaskComponent({
      title: task.title,
      stopTask: () => this.stopTask(task.id),
    });
    this.element.querySelector('.performance-report--run-list').appendChild(task.component.element);

  }

  stopTask(id) {
    console.log(`stoping task ${id}`);

    this.worker.postMessage({
      type: MESSAGE_TYPES.STOP_TASK,
      payload: {
        id: id,
      },
    });
  }

  updateTask(id, data) {
    console.log(`updating task ${id}`);
    const task = this.tasks.find(t => t.id === id);

    task.component.update(data);
  }

  completeTask(id, data) {
    console.log(`task ${id} complete`);

    const task = this.tasks.find(t => t.id === id);

    task.component.complete(data);
  }

}

class TaskComponent {
  constructor({ title, stopTask }) {
    const template = loadTemplate('performance-task');

    this.element = template.firstElementChild;
    this.element.addEventListener('click', stopTask);

    this.getField('title').textContent = title;

    this.update({ percentComplete: 0, runTimeMs: 0 });
  }

  getField(name, element) {
    element = element || this.element;
    const selector = `.performance-task--${name}`;
    return element.querySelector(selector);
  }

  update(stats) {
    this.getField('progress-bar').style.width = `${stats.percentComplete}%`;

    const results = this.getField('results');
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }

    const formatted = this.formatStats(stats);

    Object.keys(formatted).forEach(field => {
      const resultItem = loadTemplate('performance-task--result-item');
      resultItem.firstElementChild.textContent = `${field}: ${formatted[field]}`;
      results.appendChild(resultItem);
    });
  }

  complete(stats) {
    this.update(stats);

    this.getField('stop-button').setAttribute('disabled', 'true');
  }

  formatStats(stats) {
    const formatted = {};

    Object.keys(stats).forEach(field => {
      const value = stats[field];
      switch (field) {
        case 'id':
          break;

        case 'percentComplete':
          formatted['progress'] = `${value}%`;
          break;

        case 'runTimeMs':
          formatted['time'] = `${value.toLocaleString()} ms`;
          break;

        case 'totalTimeMs':
          if (stats.runTimeMs) {
            const overhead = value - stats.runTimeMs;
            formatted['system overhead'] = `${overhead.toLocaleString()} ms`;
          } else {
            formatted[field] = value;
          }
          break;

        case 'size':
          formatted['size'] = prettyBytes(value);
          break;

        default:
          formatted[field] = value;
      }
    });

    return formatted;
  }
}



