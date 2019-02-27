import {TapType} from '../constants';

export function tapCount(tapType) {
    let tapCount = 1;

    if (tapType === TapType.double) {
        tapCount = 2;
    } else if (tapType === TapType.triple) {
        tapCount = 3;
    }

    return tapCount;
}