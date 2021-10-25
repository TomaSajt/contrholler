<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import ScreenCenter from "$lib/components/ScreenCenter.svelte";
    import Stick from "$lib/components/Stick.svelte";
    import { move, init, servo, buzzer, LED } from "@kareszklub/roblib-client";
    import { io } from "socket.io-client";
    import { page } from "$app/stores";
    let debugJoystick = false;
    const dev = $page.query.get("dev") == "true";
    let initPromise = dev ? Promise.resolve() : init(io, "192.168.0.1:5000");
    let started = false;

    /**
     * The current states of the leds
     */
    let ledState = {
        r: false,
        g: false,
        b: false,
    };
    let buzzerState = 100;
    /**
     * The current angle of the head servo in degrees.
     * Value ranges between -90 and 90
     */
    let servoState = 0;
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
    $: unscaledSpeedState = {
        left: deadPolar.arg * Math.cos(deadPolar.angle - Math.PI / 4),
        right: -deadPolar.arg * Math.cos(deadPolar.angle + Math.PI / 4),
    };
    /**
     * The speed of the left and right tracks ranging from -maxSpeed to maxSpeed
     */
    $: speedState = {
        left: Math.round(unscaledSpeedState.left * maxSpeed * 100) / 100,
        right: Math.round(unscaledSpeedState.right * maxSpeed * 100) / 100,
    };

    //Sending the updates when certain values change
    $: if (started) r(sendSpeedUpdate, [speedState]);
    $: if (started) r(sendLedUpdate, [ledState]);
    $: if (started) r(sendServoUpdate, [servoState]);
    $: if (started) r(sendBuzzerUpdate, [buzzerState]);
    function sendSpeedUpdate() {
        console.log(JSON.stringify(speedState));
        if (!dev) move(speedState);
    }
    function sendLedUpdate() {
        console.log(JSON.stringify(ledState));
        if (!dev) LED(ledState);
    }
    function sendServoUpdate() {
        console.log(servoState);
        if (!dev) servo(servoState);
    }
    function sendBuzzerUpdate() {
        console.log(buzzerState);
        if (!dev) buzzer(buzzerState);
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
                    <div class="mx-auto text-center mb-6 overflow-hidden">
                        <p>{JSON.stringify(deadPolar)}</p>
                        <p>{JSON.stringify(speedState)}</p>
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
                        {ledState.r ? 255 : 0},
                        {ledState.g ? 255 : 0},
                        {ledState.b ? 255 : 0}
                    );"
                            />
                        </div>
                        <div class="flex justify-center gap-1">
                            <Button
                                color={ledState.r ? "red" : "gray"}
                                onClick={() => (ledState.r = !ledState.r)}
                                >Red</Button
                            >
                            <Button
                                color={ledState.g ? "green" : "gray"}
                                onClick={() => (ledState.g = !ledState.g)}
                                >Green</Button
                            >
                            <Button
                                color={ledState.b ? "blue" : "gray"}
                                onClick={() => (ledState.b = !ledState.b)}
                                >Blue</Button
                            >
                        </div>
                    </div>
                    <div
                        class="text-center bg-[#1b1d20] rounded-lg p-4 h-[fit-content]"
                    >
                        <label for="servo" class="text-lg"
                            >Servo: {servoState}°</label
                        >
                        <input
                            id="servo"
                            type="range"
                            class="w-full"
                            bind:value={servoState}
                            min={-90}
                            max={90}
                        />
                        <label for="buzzer" class="text-lg"
                            >Buzzer: {buzzerState}pw</label
                        >
                        <input
                            id="buzzer"
                            type="range"
                            class="w-full"
                            bind:value={buzzerState}
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
