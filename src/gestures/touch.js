import Hammer from 'hammerjs';
import {TapType, FingersCount} from '../constants';
import {AbstractGesture} from './abstract-gesture';

export class TouchGesture extends AbstractGesture {
    constructor(element, {tapType = TapType.single, fingers = FingersCount.one, timeout = 1}) {
        super(element, {
            start: 'panstart',
            move: 'panmove',
            end: 'panend',
            init: 'press',
            initEnd: 'pressup',
            InitEventClass: Hammer.Press,
            EventClass: Hammer.Pan,
            eventOptions: {pointers: fingers},
            initEventOptions: {pointers: fingers, time: tapType === TapType.long ? timeout : 0},
            isMouse: false
        });
    }
}
