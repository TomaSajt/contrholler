<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import ScreenCenter from "$lib/components/ScreenCenter.svelte";
    import Stick from "$lib/components/Stick.svelte";
    import * as Roblib from "@kris030/roblib";
    import { io } from "socket.io-client";
    import { page } from "$app/stores";
    let debugJoystick = false;
    const dev = $page.query.get("dev") == "true";
    let initPromise = dev
        ? Promise.resolve()
        : Roblib.init(io, "192.168.0.1:5000");
    let started = false;

    /**
     * The current states of the leds
     */
    let leds = {
        r: false,
        g: false,
        b: false,
    };
    let buzzer = 100;
    /**
     * The current angle of the head servo in degrees.
     * Value ranges between -90 and 90
     */
    let servo = 0;
    /**
     * The maximum speed a track can go
     */
    const maxSpeed = 100;
    /**
     * The polar form of the youstick after applying the deadzones
     * bound to the Stick component's exported value.
     * @param angle ranges from -pi to pi
     * @param arg ranges from 0 to 1
     */
    let deadPolar = { angle: 0, arg: 0 };
    /**
     * The speed of the left and right tracks.
     * Values range from -1 to 1
     */
    $: speed = {
        left: deadPolar.arg * Math.cos(deadPolar.angle - Math.PI / 4),
        right: -deadPolar.arg * Math.cos(deadPolar.angle + Math.PI / 4),
    };
    /**
     * The speed of the left and right tracks ranging from -maxSpeed to maxSpeed
     */
    $: scaledSpeed = {
        left: Math.round(speed.left * maxSpeed * 100) / 100,
        right: Math.round(speed.right * maxSpeed * 100) / 100,
    };

    //Sending the updates when certain values change
    $: if (started) r(sendSpeedUpdate, [scaledSpeed]);
    $: if (started) r(sendLedUpdate, [leds]);
    $: if (started) r(sendServoUpdate, [servo]);
    $: if (started) r(sendBuzzerUpdate, [buzzer]);
    function sendSpeedUpdate() {
        console.log(JSON.stringify(scaledSpeed));
        if (!dev) Roblib.move(scaledSpeed);
    }
    function sendLedUpdate() {
        console.log(JSON.stringify(leds));
        if (!dev) Roblib.LED(leds);
    }
    function sendServoUpdate() {
        console.log(servo);
        if (!dev) Roblib.servo(servo);
    }
    function sendBuzzerUpdate() {
        console.log(buzzer);
        if (!dev) Roblib.buzzer(buzzer);
    }
    /**
     * Utility function that runs the given function when the given variables change.
     */
    function r(func: () => any, _: any[]) {
        func();
    }
</script>

<svelte:head>
    <title>Joystick Controller</title>
</svelte:head>
{#await initPromise.then(() => (started = true))}
    <ScreenCenter>
        <p class="text-center text-4xl font-bold mb-3 px-12">Connecting...</p>
        <progress class="max-w-[500px] w-[100vw] px-4" />
    </ScreenCenter>
{:then _}
    <div class="bg-[#414346]">
        <div class="bg-[#121212] min-h-screen max-w-screen-xl mx-auto">
            <div class="w-5/6 mx-auto py-6  text-white">
                <h1 class="text-center text-5xl mb-2">
                    Roland joystick controller
                </h1>
                <h2 class="text-center text-2xl mb-6">Powered by roblib</h2>
                <div class="flex justify-center mb-6">
                    <div class="max-w-screen-sm w-full">
                        <Stick
                            onChange={(newPolar) => (deadPolar = newPolar)}
                            debug={debugJoystick}
                        />
                    </div>
                </div>

                <div class="flex justify-center mb-6">
                    <Button
                        color={debugJoystick ? "red" : "gray"}
                        onClick={() => (debugJoystick = !debugJoystick)}
                        >Toggle debug</Button
                    >
                </div>
                {#if debugJoystick}
                    <div class="mx-auto text-center mb-6">
                        <p>{JSON.stringify(deadPolar)}</p>
                        <p>{JSON.stringify(scaledSpeed)}</p>
                    </div>
                {/if}

                <div class="grid sm:grid-cols-1 md:grid-cols-2 mx-auto gap-8">
                    <div class="bg-[#1b1d20] rounded-lg p-4">
                        <div class="flex justify-center mb-6">
                            <div
                                class="w-2/3 rounded-full ring-4 ring-black"
                                style="
                    aspect-ratio: 1 / 1;
                    background-color: rgb(
                        {leds.r ? 255 : 0},
                        {leds.g ? 255 : 0},
                        {leds.b ? 255 : 0}
                    );"
                            />
                        </div>
                        <div class="flex justify-center gap-1">
                            <Button
                                color={leds.r ? "red" : "gray"}
                                onClick={() => (leds.r = !leds.r)}>Red</Button
                            >
                            <Button
                                color={leds.g ? "green" : "gray"}
                                onClick={() => (leds.g = !leds.g)}>Green</Button
                            >
                            <Button
                                color={leds.b ? "blue" : "gray"}
                                onClick={() => (leds.b = !leds.b)}>Blue</Button
                            >
                        </div>
                    </div>
                    <div
                        class="text-center bg-[#1b1d20] rounded-lg p-4 h-[fit-content]"
                    >
                        <label for="servo" class="text-lg"
                            >Servo: {servo}°</label
                        >
                        <input
                            id="servo"
                            type="range"
                            class="w-full"
                            bind:value={servo}
                            min={-90}
                            max={90}
                        />
                        <label for="buzzer" class="text-lg"
                            >Buzzer: {buzzer}pw</label
                        >
                        <input
                            id="buzzer"
                            type="range"
                            class="w-full"
                            bind:value={buzzer}
                            min={0}
                            max={100}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
{:catch err}
    <ScreenCenter>
        <p class="text-center text-4xl font-bold mb-3">{err}</p>
    </ScreenCenter>
{/await}
