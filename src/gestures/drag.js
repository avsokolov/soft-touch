import Hammer from 'hammerjs';
import {TapType, FingersCount, InputType} from '../constants';
import {AbstractHammerGesture} from './abstract-hammer-gesture';

export class TouchClickGesture extends AbstractHammerGesture {
    constructor(element, {tapType = TapType.single, fingers = FingersCount.one, timeout = 1, inputType = InputType.any}) {
        super(element, {
            start: 'panstart',
            move: 'panmove',
            end: 'panend',
            init: 'press',
            initEnd: 'pressup',
            InitEventClass: Hammer.Press,
            EventClass: Hammer.Pan,
            eventOptions: {pointers: fingers},
            initEventOptions: {pointers: fingers, time: tapType === TapType.long ? timeout : undefined},
            source: inputType
        });
    }
}
