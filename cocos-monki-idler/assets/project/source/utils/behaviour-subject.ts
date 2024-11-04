type Callback<TObject> =  (value: TObject) => void

export class BehaviorSubject<TObject> {

    private _callbacks: Callback<TObject>[] = [];

    public value: TObject;

    public constructor(object: TObject) {
        this.value = object;
    }

    public next(value: TObject): void {
        this.value = value;

        for (let index = 0, count = this._callbacks.length; index < count; index++) {
            const callback = this._callbacks[index];

            callback(value);
        }
    }

    public on(callback: Callback<TObject>): void {
        this._callbacks.push(callback);

        callback(this.value);
    }

    public off(callback: Callback<TObject>): void {
        this._callbacks = this._callbacks.filter(cb => cb !== callback);
    }
}