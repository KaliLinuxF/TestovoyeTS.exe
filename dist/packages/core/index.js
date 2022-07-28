'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var dotenv = require('dotenv');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

dotenv.config({
    path: path__default["default"].resolve('.env')
});

let Place = class Place {
    constructor(name, spawn1Coords, spawn2Coords, isFree){
        this.placeName = name;
        this.spawn1Coords = spawn1Coords;
        this.spawn2Coords = spawn2Coords;
        this.isFree = isFree;
    }
};
let PlacePool = class PlacePool {
    addPlace(place) {
        this.places.push(place);
    }
    getRandomPlace() {
        if (!this.places || this.places.length < 1) {
            return;
        }
        let randomNumber = Math.floor(Math.random() * (this.places.length - 0 + 1)) + 0;
        while(!this.places[randomNumber].isFree){
            randomNumber = Math.floor(Math.random() * (this.places.length - 0 + 1)) + 0;
        }
        return this.places[randomNumber];
    }
    constructor(){
        this.places = [];
    }
};
const placePool = new PlacePool();
mp.events.addCommand('addPlace', (player, _, name)=>{
    if (typeof name !== 'string') {
        return;
    }
    const place = new Place(name, player.position, new mp.Vector3(player.position.x + 3, player.position.y, player.position.z), false);
    placePool.addPlace(place);
    console.log(`Место добавлено, имя: ${place.placeName}`);
});

function message(player, message1) {
    player.call('chatMessage', [
        message1
    ]);
}

exports.message = message;
