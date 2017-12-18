export default class Subject {
  constructor(value) {
    this.value = value;
    this._subscribers = [];
  }

  getValue() {
    return this.value;
  }

  next(nextValue) {
    this.value = nextValue;
    this._subscribers.forEach(subscriber => subscriber.call(this, nextValue));
  }

  subscribe(subscriber) {
    this._subscribers.push(subscriber);

    return () => {
      this._subscribers = this._subscribers.filter(s => s !== subscriber);
    };
  }
}
