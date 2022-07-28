interface DuelPlace {
    placeName: string
    spawn1Coords: Vector3,
    spawn2Coords: Vector3,
    isFree: boolean
};

class Place {
    placeName: string;
    spawn1Coords: Vector3;
    spawn2Coords: Vector3;
    isFree: boolean;

    constructor(name: string, spawn1Coords: Vector3, spawn2Coords: Vector3, isFree: boolean) {
        this.placeName = name;
        this.spawn1Coords = spawn1Coords;
        this.spawn2Coords = spawn2Coords;
        this.isFree = isFree;
    }

    
}

class PlacePool {
    places: Array<Place>

    constructor() {
        this.places = []; 
    }

    addPlace(place: Place) {
        this.places.push(place);
    }

    getRandomPlace() {
        if(!this.places || this.places.length < 1) {
           return;
        }        

        let randomNumber = Math.floor(Math.random() * (this.places.length - 0 + 1)) + 0;

        while (!this.places[randomNumber].isFree) {
            randomNumber = Math.floor(Math.random() * (this.places.length - 0 + 1)) + 0;
        };

        return this.places[randomNumber];
    }

    // getPlaceByName(name: string) {
    //     return this.places
    // }

     // removePlace(place: Place) {
        
    // }

    // loadPlacesFromFile() {

    // }

    // savePlacesToFile() {

    // }
   
}

const placePool = new PlacePool();

mp.events.addCommand('addPlace', (player, _, name) => {

    if(typeof name !== 'string') {
        return;
    }

    const place : DuelPlace = new Place(name, player.position, new mp.Vector3(player.position.x + 3, player.position.y, player.position.z), false);

    placePool.addPlace(place);

    console.log(`Место добавлено, имя: ${place.placeName}`);
});

export { Place, placePool };