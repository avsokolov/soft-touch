import {AbstractGesture} from './abstract-gesture';

export class MouseWheelGesture extends AbstractGesture {
    constructor(element, options) {
        super(element, options);
        this.event = {deltaX: undefined, deltaY: undefined};

        element.addEventListener('wheel', e => {
            e = e || window.event;

            this.event.deltaY = e.deltaY || e.detail;
            this.event.deltaX = e.deltaX || 0;
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            AbstractGesture._call(this._handlers.move);
            Promise.resolve().then(() => {
                this.event.deltaX = undefined;
                this.event.deltaY = undefined;
            })
        });
    }
}
