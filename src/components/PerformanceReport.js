import Task from './Task';

import { loadTemplate } from './util';
import { MESSAGE_TYPES, TASK_TYPES } from '../messages';

class PerformanceReport {
  constructor(dataStructureName) {
    this.tasks = [];
    this.dsName = dataStructureName;

    const title = dataStructureName;
    this.element = this.buildElement(title);
    this.worker = this.initializeWorker();

    this.loadDictionary('small');
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
      const lookupCount = this.getField('lookup-count', element).value;
      this.profilePerformance(lookupCount);
    });

    this.getField('load-dictionary-button', element).addEventListener('click', () => {
      const dictionarySize = this.getField('dictionary-size', element).value;
      this.loadDictionary(dictionarySize);
    })

    const reportList = document.querySelector('.performance--report-list');
    reportList.appendChild(report);


    return element;
  }

  initializeWorker() {
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
    this.launchTask({
      title: `${lookupCount.toLocaleString()} lookups`,
      type: TASK_TYPES.PROFILE,
      lookupCount,
    });
  }

  loadDictionary(size) {
    this.launchTask({
      title: `load ${size} dictionary`,
      type: TASK_TYPES.INITIALIZE,
      dictionarySize: size,
      dataStructure: this.dsName,
    });
  }

  launchTask(task) {
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
    const runList = this.getField('run-list');
    runList.insertBefore(task.component.element, runList.firstChild);

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
    const task = this.tasks.find(t => t.id === id);

    task.component.complete(data);
  }

}

export default PerformanceReport;