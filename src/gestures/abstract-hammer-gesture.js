import Hammer from 'hammerjs';
import {InputType} from '../constants';
import {AbstractGesture} from './abstract-gesture';

//Map of hammer wrapped elements
const elements = new Map();

export class AbstractHammerGesture extends AbstractGesture {
    constructor(element, options) {
        if (!elements.has(element)) {
            elements.set(element, new Hammer(element));
        }

        element = elements.get(element);

        super(element, options);
        this._clearEvent();

        const {start, init, EventClass, eventOptions, InitEventClass, initEventOptions} = options;
        this._element.add(new EventClass(eventOptions));
        if (InitEventClass) {
            this._element.add(new InitEventClass(initEventOptions));
        }

        element.on(init || start, (event) => this._beginEvent(event));
    }

    _checkEvent(event) {
        return (
            this._options.source === InputType.any ||
            (event.pointerType === 'mouse') === (this._options.source === InputType.mouse)
        );
    }

    _beginEvent(event) {
        if (!this._checkEvent(event)) return;
        event.preventDefault();

        this._initEvent(event);

        if (event.type === this._options.start) {
            this._element.on(this._options.move, (event) => this._moveEvent(event));
            this._element.on(start, (event) => this._endEvent(event));
        } else {
            this._element.on(this._options.start, () => {
                this._element.on(this._options.move, (event) => this._moveEvent(event));
                this._element.on(this._options.end, (event) => this._endEvent(event));
            });
            this._element.on(this._options.initEnd, (event) => this._endEvent(event));
        }

        AbstractGesture._call(this._handlers.begin);
    }
    _moveEvent(event) {
        if (!this.event.touches.length) return;
        event.preventDefault();

        this._updateEvent(event);
        this._handlers.move.forEach(cb => cb());
        this.event.speed = 0;
    }
    _endEvent(event) {
        if (!this.event.touches.length) return;
        event.preventDefault();

        this._element.off(this._options.move);
        this._element.off(this._options.end);
        if (this._options.initEnd) {
            this._element.off(this._options.initEnd);
        }
        if (this._options.init) {
            this._element.off(this._options.start);
        }

        this._updateEvent(event);
        this._handlers.end.forEach(cb => cb());
        this._clearEvent();
    }

    _initEvent(event) {
        this.event.touches = event.pointers.map(pointer => {
            return {
                ox: pointer.clientX,
                oy: pointer.clientY,
                x: pointer.clientX,
                y: pointer.clientY
            };
        });
        this.event.speed = 0;
        this.event.centerX = event.center.x;			// center of touch, equals to x, y for one finger or mouse
        this.event.centerY = event.center.y;
        this.event.rotation = event.angle;
        this.event.distance = event.distance;
        this._lastTime = new Date();
    }

    _updateEvent(event) {
        event.pointers.forEach((pointer, num) => {
            if (this.event.touches[num]) {
                this.event.touches[num].x = pointer.clientX;
                this.event.touches[num].y = pointer.clientY;
            }
        });
        const time = new Date();
        this.event.speed = Math.abs(this.event.distance - event.distance)/(time-this._lastTime)*1000; //pixels per second
        this.event.centerX = event.center.x;			// center of touch, equals to x, y for one finger or mouse
        this.event.centerY = event.center.y;
        this.event.rotation = event.angle;
        this.event.distance = event.distance;
        this._lastTime = time;
    }

    _clearEvent() {
        this.event.touches = [];
        this.event.speed = 0;
        this.event.centerX = NaN;			// center of touch, equals to x, y for one finger or mouse
        this.event.centerY = NaN;
        this.event.rotation = 0;
        this.event.distance = 0;
        this._lastTime = 0;
    }
}
