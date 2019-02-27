import {TapType, FingersCount, GestureType, InputType, MouseSegment} from './constants';
import {DragGesture} from './gestures/drag';
import {TouchClickGesture} from './gestures/touch-click';
import {MouseWheelGesture} from './gestures/mouse-wheel';
import {MouseOverGesture} from './gestures/mouse-over';
import {DragOverGesture} from './gestures/drag-over';

export const Types = {
    TapType,
    FingersCount,
    GestureType,
    InputType,
    MouseSegment
};

export function GestureFactory({gestureType, target, options = {}}) {
    if (!(target instanceof Node)) {
        if (target.node && target.node instanceof Node) {
            //support of SVG.JS
            target = target.node;
        } else {
            throw new Error('Target should be a DOM node or SVG.JS element');
        }
    }

    let result;
    switch (gestureType) {
        case GestureType.TouchClick:
            result = new TouchClickGesture(target, options);
            break;
        case GestureType.Drag:
            result = new DragGesture(target, options);
            break;
        case GestureType.MouseOver:
            result = new MouseOverGesture(target, options);
            break;
        case GestureType.DragOver:
            result = new DragOverGesture(target, options);
            break;
        case GestureType.MouseWheel:
            result = new MouseWheelGesture(target, options);
            break;
        default:
            throw new Error('Not implemented or unsupported gesture type');
    }

    return result;
}