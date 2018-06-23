import {TapType, FingersCount, GestureType} from './constants';
import {TouchGesture} from './gestures/touch'
import {MouseClickGesture} from './gestures/mouse-click';

export const Types = {
    TapType,
    FingersCount,
    GestureType
};

const elements = new Map();

export function GestureFactory({gestureType, target, options = {}}) {
    if (!elements.has(target)) {
        elements.set(target, new Hammer(target));
    }

    const el = elements.get(target);
    let result;
    switch (gestureType) {
        case GestureType.Touch:
            result = new TouchGesture(el, options);
            break;
        case GestureType.MouseClick:
            result = new MouseClickGesture(el, options);
            break;
        default:
            throw new Error('Not implemented or unsupported gesture type');
    }

    return result;
}