import {GestureFactory, Types} from '../src';

const draw = SVG('drawing');

const rectOver = draw.rect(100, 500).move(300, 50).fill("#aaa").attr('stroke', '#66f').attr('stroke-width', 0);
const rect1 = draw.rect(200, 200).move(50, 50).fill("#9cf");
const rect2 = draw.rect(200, 200).move(50, 300).fill("#7ef");

const rect1Touch = GestureFactory({
    gestureType: Types.GestureType.TouchClick,

    options: {
        tapType: Types.TapType.long,
        inputType: Types.InputType.any,
        timeout: 500
    },
    target: rect1
});

const rect2Touch = GestureFactory({
    gestureType: Types.GestureType.TouchClick,
    options: {
        tapType: Types.TapType.single
    },
    target: rect2
});

const dragOver = GestureFactory({
    gestureType: Types.GestureType.DragOver,
    options: {},
    target: rectOver
});

dragOver.begin(() => {
    rectOver.attr('stroke-width', 2);
    console.log(dragOver.event);
});
dragOver.end(() => {
    rectOver.attr('stroke-width', 0);
});

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

let item1Pos;
rect1Touch.begin(() => {
    item1Pos = {
        x: rect1.x(),
        y: rect1.y()
    };
    rect1.attr('stroke-width', 1);
});
rect1Touch.move(() => {
    rect1.move(
        item1Pos.x + (rect1Touch.event.touches[0].x - rect1Touch.event.touches[0].ox),
        item1Pos.y + (rect1Touch.event.touches[0].y - rect1Touch.event.touches[0].oy)
    );
    console.log(JSON.stringify(rect1Touch.event));
});
rect1Touch.end(() => {
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

let initPos;
rect2Touch.begin(() => {
    rect2.attr('stroke-width', 1);
    initPos = {
        x: rect2.x(),
        y: rect2.y()
    };
});
rect2Touch.move(() => {
    rect2.move(
        initPos.x + (rect2Touch.event.touches[0].x - rect2Touch.event.touches[0].ox),
        initPos.y + (rect2Touch.event.touches[0].y - rect2Touch.event.touches[0].oy)
    );
});
rect2Touch.end(() => {
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