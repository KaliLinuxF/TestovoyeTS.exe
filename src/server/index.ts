import './setup';
import './Duels/duelPlace'

function message(player: PlayerMp, message: string) {
	player.call('chatMessage', [message]);
}

export { message };