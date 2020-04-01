import { MESSAGE_TYPES, TASK_TYPES } from "./messages";

import dataStructureList from './data_structures/data_structure_list';

import words10KRaw from '../10000-words.txt';
import words100KRaw from '../100000-words.txt';

import { executionTimeMs } from './performance';
import sizeof from "object-sizeof";
import seedrandom from 'seedrandom';

const WORK_INCREMENT = 256;

class PerfRunner {
  constructor() {
    this.tasks = [];
    // {
    //   id: number,
    //   cancelled: boolean,
    //   finished: boolean,
    //   type: string
    // }

    addEventListener('message', this.handleMessage);
  }

  handleMessage = (event) => {
    const message = event.data;

    switch (message.type) {
      case MESSAGE_TYPES.NEW_TASK: {
        this.tasks.push(message.payload);
        setTimeout(this.initializeTask, 0, message.payload);
        break;
      }
      case MESSAGE_TYPES.STOP_TASK: {
        const task = this.tasks.find(task => task.id === message.payload.id);
        if (task) {
          task.cancelled = true;
        }
        break;
      }
      default: {
        console.log(`Perf worker received bogus message type ${message.type}`);
      }
    }
  }

  initializeTask = (task) => {
    // Do some setup
    task.cancelled = false;
    task.finished = false;
    task.startTime = performance.now();
    task.runTimeMs = 0;
    task.completedIterations = 0;
    task.buildCompletionPayload = () => undefined;

    switch (task.type) {
      case TASK_TYPES.INITIALIZE:
        this.loadDataStructure(task);
        break;

      case TASK_TYPES.PROFILE:
        this.profilePerformance(task);
        break;

      default:
        console.log(`Perf worker asked to start unknown task type ${task.type}`);
        break;
    }
  }

  loadDataStructure(task) {
    const DataStructure = dataStructureList[task.dataStructure];
    if (!DataStructure) {
      throw new Error(`Perf test worker asked to load unknown data structure ${task.dataStructure}`);
    }

    this.ds = new DataStructure();

    if (task.dictionarySize === 10000) {
      task.dictionary = words10KRaw.split('\n');
    } else if (task.dictionarySize === 100000) {
      task.dictionary = words100KRaw.split('\n');
    }

    task.totalIterations = task.dictionary.length;

    task.doWork = (task, i) => this.ds.addWord(task.dictionary[i]);
    task.buildCompletionPayload = () => ({ size: sizeof(this.ds) });
    setTimeout(this.processTask, 0, task);
  }

  profilePerformance(task) {
    const rng = seedrandom('ada developers academy');
    task.totalIterations = task.lookupCount;
    task.doWork = () => {
      // lookup prefixes between 1 and 6 characters
      const length = Math.floor(rng() * 6) + 1;

      let prefix = "";
      for (let j = 0; j < length; j += 1) {
        prefix += Math.floor(rng() * 8) + 2;
      }

      this.ds.lookupPrefix(prefix);
    }
    setTimeout(this.processTask, 0, task);
  }

  processTask = (task) => {
    if (task.cancelled) {
      console.log(`Bailing early from cancelled task ${task.id}`);
      task.finished = true;
      return;
    }

    const remainingIterations = task.totalIterations - task.completedIterations;
    const scheduledIterations = Math.min(WORK_INCREMENT, remainingIterations);

    const runTimeMs = executionTimeMs(() => {
      for (let i = task.completedIterations;
        i < task.completedIterations + scheduledIterations;
        i += 1) {
        task.doWork(task, i);
      }
    });

    task.runTimeMs += runTimeMs;
    task.completedIterations += scheduledIterations;
    const percentComplete = Math.round(100.0 * task.completedIterations / task.totalIterations);

    postMessage({
      type: MESSAGE_TYPES.TASK_UPDATE,
      payload: {
        id: task.id,
        percentComplete: percentComplete,
        runTimeMs: task.runTimeMs,
      },
    });

    if (task.completedIterations < task.totalIterations) {
      // Not finished yet, queue up more work
      setTimeout(this.processTask, 0, task);

    } else {
      postMessage({
        type: MESSAGE_TYPES.TASK_COMPLETE,
        payload: {
          id: task.id,
          percentComplete: 100,
          runTimeMs: task.runTimeMs,
          totalTimeMs: performance.now() - task.startTime,
          ...task.buildCompletionPayload(),
        }
      });
      task.finished = true;
    }
  }

}

new PerfRunner();