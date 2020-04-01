import { MESSAGE_TYPES, TASK_TYPES } from "./messages";

import dataStructureList from './data_structures/data_structure_list';

import words10KRaw from '../10000-words.txt';
import words100KRaw from '../100000-words.txt';

import { executionTimeMs } from './performance';
import sizeof from "object-sizeof";

const WORK_INCREMENT = 1024;

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
        console.log(`Perf test worker received bogus message type ${message.type}`);
      }
    }
  }

  initializeTask = (task) => {
    // Do some setup
    task.cancelled = false;
    task.finished = false;
    task.startTime = performance.now();
    task.runTimeMs = 0;
    task.buildCompletionPayload = () => undefined;

    switch (task.type) {
      case TASK_TYPES.INITIALIZE:
        this.loadDataStructure(task);
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

    task.wordsLoaded = 0;

    task.doWork = (task, i) => this.ds.addWord(task.dictionary[i]);
    task.buildCompletionPayload = () => ({ size: sizeof(this.ds) });
    setTimeout(this.processTask, 0, task);
  }

  profilePerformance(task) {

  }

  processTask = (task) => {
    if (task.cancelled) {
      console.log(`Bailing early from cancelled task ${task.id}`);
      task.finished = true;
      return;
    }

    const wordsRemaining = task.dictionary.length - task.wordsLoaded;
    const wordsToLoad = Math.min(WORK_INCREMENT, wordsRemaining);

    const runTimeMs = executionTimeMs(() => {
      for (let i = task.wordsLoaded;
        i < task.wordsLoaded + wordsToLoad;
        i += 1) {
        task.doWork(task, i);

      }
    });

    task.runTimeMs += runTimeMs;
    task.wordsLoaded += wordsToLoad;
    const percentComplete = Math.round(100.0 * task.wordsLoaded / task.dictionary.length);

    postMessage({
      type: MESSAGE_TYPES.TASK_UPDATE,
      payload: {
        id: task.id,
        percentComplete: percentComplete,
        runTimeMs: task.runTimeMs,
      },
    });

    if (task.wordsLoaded < task.dictionary.length) {
      // Not finished yet, queue up more work
      setTimeout(this.processTask, 0, task);

    } else {
      postMessage({
        type: MESSAGE_TYPES.TASK_COMPLETE,
        payload: {
          id: task.id,
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