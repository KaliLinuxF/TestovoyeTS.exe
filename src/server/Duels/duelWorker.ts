import { Place, placePool } from './duelPlace' 
import { message } from '../index';

const WEAPON_POOL = ['weapon_pistol', 'weapon_navyrevolver', 'weapon_assaultsmg', 'weapon_musket'];
const WEAPON_AMMO = 120;

class Duel {

    place: Place;
    player1: PlayerMp;
    player2: PlayerMp;
    isFinished: boolean = false;



    constructor(place: Place, player1: PlayerMp, player2: PlayerMp) {
        this.place = place;
        this.player1 = player1;
        this.player2 = player2;

        this.getRandomWeapon();
        this.teleportToPlace();
    }

    getRandomWeapon() {
        const randomNumber = Math.floor(Math.random() * (WEAPON_POOL.length - 0 + 1)) + 0;
        this.player1.giveWeapon(WEAPON_POOL[randomNumber], WEAPON_AMMO || 10000);
        this.player2.giveWeapon(WEAPON_POOL[randomNumber], WEAPON_AMMO || 10000);
    }

    teleportToPlace() {
        this.player1.position = this.place.spawn1Coords;
        this.player2.position = this.place.spawn2Coords;
    }

    finishDuel() {
        this.isFinished = true;
    }


}


class DuelPool {
    duels: Array<Duel>;

    constructor() {
        this.duels = [];
    }

    addDuel(duel: Duel) {
        this.duels.push(duel);
    }

    removeDuel(duel: Duel) {
       for (let i = 0; i < this.duels.length; i++) {
            if(duel === this.duels[i]) {
                this.duels.splice(i, 1);
            }
       }
    }
}

const duelPool = new DuelPool();

mp.events.add('playerDeath', (player, reson, killer) => {
    if(!player.activeDuel) {
        return;
    }

    if(player.duelDeths < 3) {
        if(!player.duelDeths) {
            player.duelDeths = 0;
        }
        
        player.duelDeths += 1;
        
        const target = mp.players.at(player.requestSend);
        
        message(player, `Счет дуэли - ${player.name}: ${target.duelDeths}, ${target.name}: ${player.duelDeths}`);
    }

    if(player.duelDeths === 3) {
        const target = mp.players.at(player.requestSend);

        player.ban('pidoras');
        target.position = new Vector3(0, 0, 0);

        duelPool.removeDuel(player.activeDuel);

        player.requestSend = -1;
        player.duelRequest = -1;

        target.requestSend = -1;
        target.duelRequest = -1;

        target.duelDeths = -1;
        player.duelDeths = -1;

        message(player, 'Вы проебали');
        message(player, 'Вы выиграли');
    }
});

mp.events.addCommand('duel', (player, _, targetId) => {
    if(typeof targetId !== 'number' ) {
        message(player, 'Формат команды - /duel [ID: NUMBER]');
        return;
    }


    const target = mp.players.at(targetId);

    if(!target) {
        message(player, 'Игрок вышел');
        return;
    }

    if(player.requestSend !== -1 || target.requestSend !== -1) {
        message(player, 'Игрок уже получил реквест, либо у вас есть активный реквест')
        return;
    }

    player.requestSend = target.id;
    target.duelRequest = player.id;

    message(player, 'Вы отправили реквест на дуэль игроку ' + target.name);
    message(target, 'Вам отправили реквест на дуэль принять - /y, отказать - /n');
  
});



mp.events.addCommand('y', (player, _) => {
    if(player.duelRequest !== -1 || !player.duelRequest) {
        message(player, 'Вам никир не предлагал дуэль');
        return;
    }

    const target = mp.players.at(player.duelRequest);

    if(target.requestSend === -1 || !target.requestSend || !target) {
        message(player, 'Игрок вышел, либо сейчас не принимает дуэли');
        return;
    }

    const place = placePool.getRandomPlace();

    if(!place) {
        message(player, 'Нету доступных мест');
        return;
    }

    message(player, 'Дуэль начнется через 10 секунд');

    setTimeout(() => {
        const duel = new Duel(place, player, target);

        duelPool.addDuel(duel);

        player.activeDuel = duel;
        target.activeDuel = duel;

        message(player, 'Дуэль началась, удачи!');
        message(target, 'Дуэль началась, удачи!');
    }, 10000);
    

});

mp.events.addCommand('n', (player, _) => {
    if(player.duelRequest === -1 || !player.duelRequest) {
        message(player, 'Вам никто не предлагал дуэль');
        // message nikto i ne predlagal kekw
        return;
    }

    const target = mp.players.at(player.duelRequest);

    if(!target || target.requestSend === -1 || !target.requestSend) {
        message(player, 'Вы уже предложили дуэль');
        return;
    }

    player.duelRequest = -1; 
    target.requestSend = -1;

    message(target, 'Чел зассал, вы можете нажать дуэль ещё раз');
});

mp.events.add('playerQuit', (player, exitType) => {
    if(player.requestSend !== -1) {
       
        const target = mp.players.at(player.requestSend);

        if(!target) {
            player.requestSend = -1;
            return;
        }

        target.duelRequest = -1;
        // message o tom 4to 4el sam je livnul
        player.requestSend = -1;
        return;
    }

    if(player.duelRequest !== -1) {
        const target = mp.players.at(player.duelRequest);

        if(!target) {
            player.duelRequest = -1;
            return;
        }

        target.requestSend = -1;
        // message o tom 4to 4el slilsa

        player.duelRequest = -1;
    }
});

export { Duel };