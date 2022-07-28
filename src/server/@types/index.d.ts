import { Duel } from '../Duels/duelWorker'

declare global {
	interface PlayerMp {
		requestSend: number,
		duelRequest: number;
		duelDeths: number,
		activeDuel: Duel
	}
}

export {};
