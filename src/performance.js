import sizeof from 'object-sizeof'
import seedrandom from 'seedrandom'

import words10KRaw from '../10000-words.txt';
import words100KRaw from '../100000-words.txt';

const words10K = words10KRaw.split('\n');
const words100K = words100KRaw.split('\n');

const executionTimeMs = (callback) => {
  const t0 = performance.now();
  callback();
  const t1 = performance.now();
  return t1 - t0;
}

const doLookups = (ds, count) => {
  const rng = seedrandom('ada developers academy');
  for (let i = 0; i < count; i += 1) {
    // lookup prefixes between 1 and 6 characters
    const length = Math.floor(rng() * 6) + 1;
    let prefix = "";
    for (let j = 0; j < length; j += 1) {
      prefix += Math.floor(rng() * 8) + 2;
    }

    ds.lookupPrefix(prefix);
  }
}

const profile = (DataStructure) => {
  console.log(`beginning profile of ${DataStructure}`);
  const stats = {};

  const recordStats = (words) => {
    const stats = {}
    let ds;
    stats.startupTime = executionTimeMs(() => {
      ds = new DataStructure(words);
    });
    stats.memoryFootprint = sizeof(ds);
    stats.shortTestTime = executionTimeMs(() => {
      doLookups(ds, 100);
    });
    stats.longTestTime = executionTimeMs(() => {
      doLookups(ds, 1000);
    });
    return stats;
  }

  // warm up the JIT
  recordStats(words10K)

  stats.smallDictionary = recordStats(words10K);
  stats.largeDictionary = recordStats(words100K);
  return stats;
}

export default profile;