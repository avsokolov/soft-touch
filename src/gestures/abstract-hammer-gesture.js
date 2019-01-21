import Hammer from 'hammerjs';
import {InputType} from '../constants';
import {AbstractGesture} from './abstract-gesture';

export class AbstractHammerGesture extends AbstractGesture {
    constructor(element, options) {
        element = Hammer(element);
        //remove default recognizers
        while(element.recognizers.length) element.remove(element.recognizers[0]);

        super(element, options);
        this._clearEvent();

        const {init, EventClass, eventOptions, InitEventClass, initEventOptions} = options;
        this._element.add(new InitEventClass(initEventOptions));

        if (EventClass) {
            this._mainRecognizer = new EventClass(eventOptions);
            this._element.add(this._mainRecognizer);
            this._mainRecognizer.set({ enable: false });
        }

        element.on(init, (event) => this._beginEvent(event));
        if (this._options.cancel) {
            this._element.on(this._options.cancel, (event) => this._endEvent(event));
        }
    }

    _checkEvent(event) {
        return (
            !event.srcEvent.handled && (
                this._options.source === InputType.any ||
                (event.pointerType === 'mouse' && this._options.source === InputType.mouse) ||
                (event.pointerType === 'touch' && this._options.source === InputType.touch)
            )
        );
    }

    _beginEvent(event) {
        if (!this._checkEvent(event)) return;

        event.srcEvent.stopPropagation();
        event.srcEvent.handled = true;

        this._initEvent(event);
        if (this._mainRecognizer) {
            this._mainRecognizer.set({enable: true});
        }

        if (this._options.move) {
            this._element.on(this._options.move, (event) => this._moveEvent(event));
        }

        this._element.on(this._options.end, (event) => this._endEvent(event));
        AbstractGesture._call(this._handlers.begin);
    }
    _moveEvent(event) {
        if (!this.event.touches.length) return;

        event.srcEvent.stopPropagation();
        event.srcEvent.handled = true;

        this._stateChange(() => this._updateEvent(event));
        AbstractGesture._call(this._handlers.move);
        this.event.speed = 0;
    }
    _endEvent(event) {
        if (event) {
            event.srcEvent.stopPropagation();
        }

        if (this._mainRecognizer) {
            this._mainRecognizer.set({ enable: false });
        }

        this._element.off(this._options.end);
        if (this._options.move) {
            this._element.off(this._options.move);
        }

        if (event) {
            if (event.srcEvent.handled) return;
            event.srcEvent.handled = true;
        }
        AbstractGesture._call(this._handlers.end);
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
                this.event.touches[num].dx = pointer.clientX - this.event.touches[num].x;
                this.event.touches[num].dy = pointer.clientY - this.event.touches[num].y;

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
