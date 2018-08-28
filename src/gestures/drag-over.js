import {AbstractGesture, onActiveGesturesChanged} from './abstract-gesture';
import {TouchClickGesture} from './touch-click';

export class DragOverGesture extends AbstractGesture {
    constructor(element, options) {
        super(element, options);
        this.event = {target: null};

        this._onGestureBegin = this._onGestureBegin.bind(this);
        this._onGestureMove = this._onGestureMove.bind(this);
        this._onGestureEnd = this._onGestureEnd.bind(this);

        onActiveGesturesChanged(this._onGestureBegin);
    }

    _onGestureBegin(gesture) {
        if (!(gesture instanceof TouchClickGesture)) return;

        this._gesture = gesture;
        this._active = false;

        this._checkGesture();

        this._moveOff = gesture.move(this._onGestureMove);
        this._endOff = gesture.end(this._onGestureEnd);
    }

    _onGestureMove() {
        this._checkGesture();
    }

    _onGestureEnd() {
        this._gesture = null;
        this._moveOff();
        this._endOff();

        if (this._active) {
            AbstractGesture._call(this._handlers.end);
            this.event.target = null;
            this._active = false;
        }
    }

    _checkGesture() {
        const didActive = this._active;

        const rect1 = this._element.getBoundingClientRect();
        const rect2 = this._gesture._element.element.getBoundingClientRect();

        const cross = {
            left: Math.max(rect1.left, rect2.left),
            right: Math.min(rect1.right, rect2.right),
            top: Math.max(rect1.top, rect2.top),
            bottom: Math.min(rect1.bottom, rect2.bottom)
        };

        this._active = cross.top<cross.bottom && cross.left<cross.right;

        if (this._active && !didActive) {
            this.event.target = this._gesture;
            AbstractGesture._call(this._handlers.begin);
        } else if (!this._active && didActive) {
            AbstractGesture._call(this._handlers.end);
            this.event.target = null;
        } else if (this._active && didActive) {
            AbstractGesture._call(this._handlers.move);
        }
    }
}
