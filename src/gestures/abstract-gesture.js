export const ActiveGestures = [];

const gesturesListeners = [];
const callListeners = (gesture) => gesturesListeners.forEach(cb => cb(gesture));
export const onActiveGesturesChanged = (cb) => gesturesListeners.push(cb);

export class AbstractGesture {
    constructor(element, options) {
        this._options = options;
        this._handlers = {
            begin: [],
            move: [],
            end: []
        };
        this.event = {};
        this._element = element;

        this.begin(() => {
            ActiveGestures.push(this);
            callListeners(this);
        });
        this.end(() => ActiveGestures.splice(ActiveGestures.indexOf(this), 1));
    }

    begin(cb) {
        this._handlers.begin.push(cb);
        return () => AbstractGesture._off(this._handlers.begin, cb);
    }

    move(cb) {
        this._handlers.move.push(cb);
        return () => AbstractGesture._off(this._handlers.move, cb);
    }

    end(cb) {
        this._handlers.end.push(cb);
        return () => AbstractGesture._off(this._handlers.end, cb);
    }

    static _off(arr, cb) {
        if (arr.includes(cb)) {
            arr.splice(arr.indexOf(cb), 1);
        }
    }

    static _call(arr) {
        arr.forEach(cb => cb());
    }
}
