import Hammer from 'hammerjs';
import {TapType, FingersCount, InputType} from '../constants';
import {AbstractHammerGesture} from './abstract-hammer-gesture';
import {tapCount} from './utils';

export class TouchClickGesture extends AbstractHammerGesture {
    constructor(element, options) {
        const {
            tapType = TapType.single,
            fingers = FingersCount.one,
            timeout = 1,
            inputType = InputType.any
        } = options;

        const eventOptions = {
            pointers: fingers,
            taps: tapCount(tapType),
            time: tapType === TapType.long ? timeout : 250,
            threshold: 5
        };

        super(element, {
            init: 'tap',
            InitEventClass: Hammer.Tap,
            initEventOptions: eventOptions,
            source: inputType
        });

        this.begin(() => {
            Promise.resolve().then(() => this._endEvent());
        });
    }
}
