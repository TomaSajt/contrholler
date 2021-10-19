import * as io from 'socket.io-client';

export let socket: ReturnType<io.Manager['socket']>;

/**
 * Kapcsolatot létesít a robottal,
 * használat előtt az `await` kulcsszóval meg kell várni,
 * először mindig ezt kell meghívni.
 * @param ip - IP:PORT
 * @returns socket.io socket
 * @example ```ts
 * await init('192.168.0.1:5000');
 * move({left: 50, right: 50});
 * ```
 */
export const init = async (ip: string) => {
	const man = new io.Manager(ip);

	// create socket
	socket = man.socket('/io', {});

	// connected to server
	return new Promise<void>((res, rej) => {
		socket.on('connect', res);
		socket.on('connect_error', rej);
	});
};

/**
 * A robot alján lévő szenzorok adataiak megszerzése.
 * @returns a négy szenzor értékei
 */
export const getSensorData = () => {
	socket.emit('tracksensor');
	return new Promise<[number, number, number, number]>(res =>
		socket.once('return-tracksensor', ({ data }) => res(data))
	);
};

/**
 * Mozgatja a lánctalp motorokat.
 * @param - left: bal motor speed, right: jobb motor speed (0-100)
 */
export const move = ({ left = 0, right = 0 } = {}) => {
	if (left < -100 || left > 100 || right < -100 || right > 100)
		throw `Values should be between -100 and 100`;
	socket.emit('move', { left, right });
};

/**
 * A robot elején lévő LED-ek színét állítja.
 * @param - r, g, b: true/false -> világítson-e vagy ne
 */
export const LED = ({ r = false, g = false, b = false } = {}) => {
	socket.emit('led', { r, g, b });
};

/**
 * A robot berregőjét irányítja.
 * @param pw - frekvencia (0-100), 100 = csend
 */
export const buzzer = (pw = 100) => {
	if (pw < 0 || pw > 100)
		throw 'PW values should be between 0 and 100';
	socket.emit('buzzer', { pw });
};

/**
 * A robot motorjainak elektronikájáról lecsapja az áramot,
 * a roboton a szervert újra kell indítani, hogy újra működjön.
 *
 *  ***WARNING: maradandóan lekapcsolja a motorokat,
 * a robotot megállítására:*** `move()`
 */
export const stop = () => { socket.emit('stop'); }

/**
 * Vár `ms` milliszekundumot, az `await` kulcsszóval kell használni.
 * @param ms - mennyi ideig
 * @example ```ts
 * console.log('most');
 * await sleep(1000);
 * console.log('1 másodperc múlva');
 * ```
 */
export const sleep = (ms: number) =>
	new Promise<void>(res => setTimeout(res, ms));

/**
 * A robot *'fejének'* (szervó motor) forgatása.
 * @param absoluteDegree - hány fokot forduljon (-90 - 90) 0 = előre néz
 */
export const servo = (absoluteDegree: number) => {
	if (absoluteDegree < -90 || absoluteDegree > 90)
		throw 'Values should be between -90 and 90';
	socket.emit('servo', { degree: absoluteDegree });
};

/**
 * megszakítja a robottal a kapcsolatot
 * @param stops - véglegesen leállítsuk-e a robot motorjait
 * (ne add meg, ha valaki más még használná)
 */
export const exit = (stops = false) => {
	if (stops)
		stop();
	socket.close();
};