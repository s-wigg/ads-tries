import { scan } from 'rxjs/operators';

class Display {
  constructor(keyPressObservable, dataStructure) {
    this.dataStructure = dataStructure;
    
    const keyCodeStream = keyPressObservable.pipe(
      scan((value, key) => {
        if (key === '#') {
          return value.slice(0, -1);
        }
        return value + key;
      }, ''),
    );
  
    const numberDisplay = document.querySelector('.display--numbers');
    keyCodeStream.subscribe(value => numberDisplay.value = value);
  
    const wordsDisplay = document.querySelector('.display--words');
    keyCodeStream.subscribe(value => {
      console.log(value);
      const possibleWords = this.dataStructure.lookupPrefix(value);
      wordsDisplay.value = possibleWords.slice(0, 5).join(', ');
    });
  }
}

export default Display;