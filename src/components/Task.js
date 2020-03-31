import prettyBytes from 'pretty-bytes';

import { loadTemplate } from './util';

class Task {
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

export default Task;