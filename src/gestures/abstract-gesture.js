export const ActiveGestures = [];

const gesturesListeners = [];
const callListeners = (gesture) => gesturesListeners.forEach(cb => cb(gesture));
export const onActiveGesturesChanged = (cb) => gesturesListeners.push(cb);

function fastClone(data) {
    const type = typeof data;

    if (
        !data ||
        type === 'number' ||
        type === 'string' ||
        type === 'boolean' ||
        type === 'function'
    ) {
        return data;
    }

    return JSON.parse(JSON.stringify(data));
}

function getDiff(prevStateNode, nextStateNode) {
    let diff;
}

export class AbstractGesture {
    constructor(element, options) {
        this._options = options;
        this._handlers = {
            begin: [],
            move: [],
            change: [],
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

    setEnable(isEnable = true) {
        this._options.disabled = !isEnable;
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

    onChange(cb) {
        this._handlers.change.push(cb);
        return () => AbstractGesture._off(this._handlers.change, cb);
    }

    _stateChange(mutator) {
        const state = fastClone(this.event);
        mutator();

        const diff = getDiff(state, this.event);
        if (diff) {
            AbstractGesture._call(this._handlers.change, diff);
        }
    }


    static _off(arr, cb) {
        if (arr.includes(cb)) {
            arr.splice(arr.indexOf(cb), 1);
        }
    }

    static _call(arr, ...args) {
        arr.forEach(cb => cb(...args));
    }
}
