import Task from './Task';

import { loadTemplate } from './util';
import { MESSAGE_TYPES, TASK_TYPES } from '../messages';

class PerformanceReport {
  constructor(dataStructure) {
    this.tasks = [];

    const title = dataStructure.name;
    this.element = this.buildElement(title);
    this.worker = this.initializeWorker();

    this.launchTask({
      title: 'load 10k words',
      type: TASK_TYPES.INITIALIZE,
      dictionarySize: 10000,
      dataStructure: dataStructure.name,
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
      const lookupCount = this.getField('lookup-count', element).value;
      this.profilePerformance(lookupCount);
    });

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