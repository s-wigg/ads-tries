import Task from './Task';

import { loadTemplate } from './util';
import { MESSAGE_TYPES, TASK_TYPES } from '../messages';
import dataStructureList from '../data_structures/data_structure_list';

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

  getField(name, element) {
    element = element || this.element;
    const selector = `.performance-report--${name}`;
    return element.querySelector(selector);
  }

  buildElement(title) {
    const report = loadTemplate('performance-report');
    const element = report.firstElementChild;

    this.getField('title', element).textContent = title;
    this.getField('run-button', element).addEventListener('click', () => {
      console.log('click');
      const lookupCount = this.getField('lookup-count', element).value;
      this.profilePerformance(lookupCount);
    });

    const reportList = document.querySelector('.performance--report-list');
    reportList.appendChild(report);

    console.log(element);

    return element;
  }

  initializeWorker() {
    console.log("initializing worker");
    const worker = new Worker('../perfrunner.worker.js', { type: 'module' });

    worker.addEventListener('message', (event) => {
      const message = event.data;
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

  profilePerformance(lookupCount) {
    console.log('Profiling performance');
    this.launchTask({
      title: `${lookupCount.toLocaleString()} lookups`,
      type: TASK_TYPES.PROFILE,
      lookupCount,
    });
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

    task.component = new Task({
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
    const task = this.tasks.find(t => t.id === id);

    task.component.update(data);
  }

  completeTask(id, data) {
    console.log(`task ${id} complete`);

    const task = this.tasks.find(t => t.id === id);

    task.component.complete(data);
  }

}

export default PerformanceReport;