import {GestureFactory, Types} from '../src';

const draw = SVG('drawing');

const rectOver = draw.rect(100, 500).move(300, 50).fill("#aaa").attr('stroke', '#66f').attr('stroke-width', 0);
const rect1 = draw.rect(200, 200).move(50, 50).fill("#9cf");
const rect2 = draw.rect(200, 200).move(50, 300).fill("#7ef");

const rect1Drag = GestureFactory({
    gestureType: Types.GestureType.Drag,
    options: {
        tapType: Types.TapType.long,
        inputType: Types.InputType.touch,
        fingers: Types.FingersCount.two,
        timeout: 500
    },
    target: rect1
});

const rect2Drag = GestureFactory({
    gestureType: Types.GestureType.Drag,
    options: {
        tapType: Types.TapType.single,
        inputType: Types.InputType.any,
    },
    target: rect2
});

const dragOver = GestureFactory({
    gestureType: Types.GestureType.DragOver,
    options: {
        startGesture: [rect1Drag, rect2Drag]
    },
    target: rectOver
});

dragOver.begin(() => {
    rectOver.attr('stroke-width', 2);
    console.log(dragOver.event);
});
dragOver.end(() => {
    rectOver.attr('stroke-width', 0);
});

const click = GestureFactory({
    gestureType: Types.GestureType.TouchClick,
    options: {
        tapType: Types.TapType.single,
        inputType: Types.InputType.any
    },
    target: rectOver
});
click.end(() => alert('Click Demo (rect over)'));

const trplClick = GestureFactory({
    gestureType: Types.GestureType.TouchClick,
    options: {
        tapType: Types.TapType.triple,
        inputType: Types.InputType.any
    },
    target: document.getElementById('drawing')
});
trplClick.end(() => alert('Triple click Demo (drawing area)'));


const wheel = GestureFactory({
    gestureType: Types.GestureType.MouseWheel,
    options: {},
    target: document.getElementById('drawing')
});

wheel.move(() => {
    if (wheel.event.deltaX) {
        rect1.x(rect1.x() - wheel.event.deltaX);
        rect2.x(rect2.x() - wheel.event.deltaX);
    }
    if (wheel.event.deltaY) {
        rect1.y(rect1.y() - wheel.event.deltaY);
        rect2.y(rect2.y() - wheel.event.deltaY);
    }
});

rect1Drag.begin(() => {
    rect1.attr('stroke-width', 1);
});
rect1Drag.move(() => {
    rect1.move(
        rect1.x() + rect1Drag.event.touches[0].dx,
        rect1.y() + rect1Drag.event.touches[0].dy
    );
    console.log(JSON.stringify(rect1Drag.event));
});
rect1Drag.end(() => {
    rect1.attr('stroke-width', 0);
    rect1.animate(500)
        .move(rect1.x()-10, rect1.y()-10)
        .size(220, 220)
        .animate(300)
        .x(rect1.x())
        .y(rect1.y())
        .width(200)
        .height(200);
});

rect2Drag.begin(() => {
    rect2.attr('stroke-width', 1);
});
rect2Drag.onChange('touches.0.x', (diff) =>  rect2.x(rect2.x() + diff));
rect2Drag.onChange('touches.0.y', (diff) => rect2.y(rect2.y() + diff));
rect2Drag.end(() => {
    rect2.attr('stroke-width', 0);
    rect2.animate(500)
        .move(rect2.x()-10, rect2.y()-10)
        .size(220, 220)
        .animate(300)
        .x(rect2.x())
        .y(rect2.y())
        .width(200)
        .height(200);
});