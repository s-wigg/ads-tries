# T9 Dictionary

## Use

### Install

```
$ git clone <repo> && cd <repo>
$ npm install
```

### Run

This week has a nifty visualization! If you run the server locally you can see:

1. A T9 keyboard backed by your trie
1. A performance profiler, comparing different implementations of the prefix dictionary interface

To run the server, type

```
$ npm start
```

This should open the browser automatically, if not navigate to `localhost:9000`

### Test

```
$ npm test
```

Runs jest in watch mode

## Assignment

### Core

Implement the Trie class to pass the tests

Play with your trie implementation using the visualization. Does it behave the way you expected?

### Optional

1. Implement a compressed radix tree, as in the discussion questions or [this article](https://medium.com/basecs/compressing-radix-trees-without-too-many-tears-a2e658adb9a0)
    - Add it to the data structure list so that the tests run against it and it appears in the performance profiler
    - How does performance compare to the uncompressed trie? To the word list?
1. Currently, lookupPrefix returns an array. Modify it to return a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) instead.

## Reference

- [10K words comes from Google](https://github.com/first20hours/google-10000-english)
- [100K words comes from dwyl](https://github.com/dwyl/english-words)
- [RxJS](https://rxjs-dev.firebaseapp.com/)
