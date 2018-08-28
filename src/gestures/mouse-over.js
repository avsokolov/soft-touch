import {AbstractGesture} from './abstract-gesture';

export class MouseOverGesture extends AbstractGesture {
    constructor(element, options) {
        super(element, options);
        this.event = {position: null};

        this._mouseEnter = this._mouseEnter.bind(this);
        this._mouseOver = this._mouseOver.bind(this);
        this._mouseOut = this._mouseOut.bind(this);

        element.addEventListener('mouseover', this._mouseEnter);
        element.addEventListener('mouseup', this._mouseEnter);
    }

    _mouseEnter(e) {
        if (!e.buttons) {
            this.event.position = {
                x: e.clientX,
                y: e.clientY,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey
            };
        } else {
            return;
        }

        AbstractGesture._call(this._handlers.begin);
        this._element.addEventListener('mousemove', this._mouseOver);
        this._element.addEventListener('mouseout', this._mouseOut);
        this._element.addEventListener('mousedown', this._mouseOut);
    }

    _mouseOver(e) {
        this.event.position = {
            x: e.clientX,
            y: e.clientY,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey
        };

        AbstractGesture._call(this._handlers.move);
    }

    _mouseOut() {
        this.event.position = null;

        AbstractGesture._call(this._handlers.end);
        this._element.removeEventListener('mousemove', this._mouseOver);
        this._element.removeEventListener('mouseout', this._mouseOut);
        this._element.removeEventListener('mousedown', this._mouseOut);
    }
}
