import {GestureFactory, Types} from '../src';

const area1 = document.getElementById('area1');
const area2 = document.getElementById('area2');

const item1 = document.getElementById('item1');
const item2 = document.getElementById('item2');
const item3 = document.getElementById('item3');
const item4 = document.getElementById('item4');

const area1Pos = area1.getBoundingClientRect();
const area2Pos = area2.getBoundingClientRect();

item1.style.left = (area1Pos.left + 10)+'px';
item1.style.top = (area1Pos.top + 10)+'px';
item2.style.left = (area1Pos.left + 10)+'px';
item2.style.top = (area1Pos.top + 50)+'px';
item3.style.left = (area2Pos.left + 10)+'px';
item3.style.top = (area2Pos.top + 10)+'px';
item4.style.left = (area1Pos.left + 10)+'px';
item4.style.top = (area1Pos.top + 100)+'px';

const item1Touch = GestureFactory({
    gestureType: Types.GestureType.Touch,
    options: {
        tapType: Types.TapType.long,
        timeout: 500
    },
    target: item1
});

const item4Touch = GestureFactory({
    gestureType: Types.GestureType.MouseClick,
    options: {
        tapType: Types.TapType.long,
        timeout: 500
    },
    target: item4
});

let item1Pos;
item1Touch.begin(() => {
    area1.classList.add('highlight');
    area2.classList.add('highlight');
    item1Pos = {
        x: parseInt(item1.style.left),
        y: parseInt(item1.style.top)
    };
});
item1Touch.move(() => {
    item1.style.left = (item1Pos.x + (item1Touch.event.touches[0].x - item1Touch.event.touches[0].ox))+'px';
    item1.style.top = (item1Pos.y + (item1Touch.event.touches[0].y - item1Touch.event.touches[0].oy))+'px';
    console.log(JSON.stringify(item1Touch.event));
});
item1Touch.end(() => {
    area1.classList.remove('highlight');
    area2.classList.remove('highlight');
});

let item4Pos;
item4Touch.begin(() => {
    area1.classList.add('highlight');
    area2.classList.add('highlight');
    item4Pos = {
        x: parseInt(item4.style.left),
        y: parseInt(item4.style.top)
    };
});
item4Touch.move(() => {
    item4.style.left = (item4Pos.x + (item4Touch.event.touches[0].x - item4Touch.event.touches[0].ox))+'px';
    item4.style.top = (item4Pos.y + (item4Touch.event.touches[0].y - item4Touch.event.touches[0].oy))+'px';
    console.log(JSON.stringify(item4Touch.event));
});
item4Touch.end(() => {
    area1.classList.remove('highlight');
    area2.classList.remove('highlight');
});