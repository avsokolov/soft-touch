import Hammer from 'hammerjs';
import {TapType, FingersCount, InputType} from '../constants';
import {AbstractHammerGesture} from './abstract-hammer-gesture';
import {tapCount} from './utils';

export class DragGesture extends AbstractHammerGesture {
    constructor(element, {tapType = TapType.single, fingers = FingersCount.one, timeout = 1, inputType = InputType.any}) {
        if (tapType === TapType.long) {
            super(element, {
                init: 'press',
                cancel: 'pressup pancancel',
                InitEventClass: Hammer.Press,
                move: 'panmove',
                end: 'panend',
                EventClass: Hammer.Pan,
                eventOptions: {pointers: fingers},
                initEventOptions: {
                    pointers: fingers,
                    taps: tapCount(tapType),
                    time: tapType === TapType.long ? timeout : 1
                },
                source: inputType
            });
        } else {
            super(element, {
                init: 'panstart',
                cancel: 'pancancel',
                InitEventClass: Hammer.Pan,
                move: 'panmove',
                end: 'panend',
                initEventOptions: {
                    pointers: fingers,
                    taps: tapCount(tapType)
                },
                source: inputType
            });
        }
    }
}
