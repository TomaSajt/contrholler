<script lang="ts">
    import { tick } from "svelte";

    import * as Roland from "$lib/roblib";
    import Button from "$lib/components/Button.svelte";
    import Stick from "$lib/components/Stick.svelte";

    let leds = {
        r: false,
        g: false,
        b: false,
    };
    let response = "?";
    let buzzer = 100;
    let servo = 0;
    let inited = false;
    let started = false;
    let debug = false;
    const speedScale = 100;

    //Clamping the dead area
    let deadPolar = { angle: 0, arg: 0 };
    //Quick mafs
    $: speed = {
        left: deadPolar.arg * Math.cos(deadPolar.angle - Math.PI / 4),
        right: -deadPolar.arg * Math.cos(deadPolar.angle + Math.PI / 4),
    };
    //Speed scaled and rounded to 2 decimals (if possible)
    $: scaledSpeed = {
        left: Math.round(speed.left * speedScale * 100) / 100,
        right: Math.round(speed.right * speedScale * 100) / 100,
    };
    //If scaled speed changes, send update
    $: if (inited) sendSpeedUpdate(scaledSpeed);
    function sendSpeedUpdate(speeds: { left: number; right: number }) {
        console.log(JSON.stringify(speeds));
        Roland.move(speeds);
    }

    //If leds change, send update
    $: if (inited) sendLedUpdate(leds);
    function sendLedUpdate(leds: { r: boolean; g: boolean; b: boolean }) {
        console.log(leds);
        Roland.LED(leds);
    }

    $: if (inited) sendServoUpdate(servo);

    function sendServoUpdate(servo: number) {
        console.log(servo);
        Roland.servo(servo);
    }
    $: if (inited) sendBuzzerUpdate(buzzer);

    function sendBuzzerUpdate(buzzer: number) {
        console.log(buzzer);
        Roland.buzzer(buzzer);
    }
</script>

<h1>Joystick for ρLAND</h1>
<h3>Powered by the ControlUtilityManagement&trade;</h3>
{#if started}
    <button on:click={() => (debug = !debug)}>Toggle Debug</button>
    {#if debug}
        <div id="debug">
            Dead polar: {JSON.stringify(deadPolar)}
            <br />
            Speed: {JSON.stringify(speed)}
            <br />
            Scaled speed:{JSON.stringify(scaledSpeed)}
        </div>
    {/if}
    {#if !inited}
        <h2>Loading...</h2>
        <br />
    {/if}
    <div class="mx-auto max-w-screen-sm">
        <Stick bind:deadPolar {debug} />
    </div>

    <!--Led buttons-->
    <div class="flex mx-auto justify-center mb-6">
        <Button onClick={() => (leds.r = !leds.r)}>Red</Button>
        <Button onClick={() => (leds.g = !leds.g)}>Green</Button>
        <Button onClick={() => (leds.b = !leds.b)}>Blue</Button>
    </div>
    <div
        id="color"
        style="background-color: rgb({leds.r ? 255 : 0},{leds.g
            ? 255
            : 0},{leds.b ? 255 : 0});"
    />

    <div id="slider-container">
        <!--Servo slider-->
        <div>
            <label for="servo">Servo: {servo}°</label>
            <input
                id="servo"
                class="slider"
                type="range"
                min="-90"
                max="90"
                bind:value={servo}
            />
        </div>
        <!--Servo slider-->
        <div>
            <label for="buzzer">Buzzer: {buzzer}pw</label>
            <input
                id="buzzer"
                class="slider"
                type="range"
                min="0"
                max="100"
                bind:value={buzzer}
            />
        </div>
    </div>

    <Button
        onClick={async () => {
            response = JSON.stringify(await Roland.getSensorData());
        }}>Get sensors</Button
    >
    <h2>{response}</h2>
    <Button
        onClick={async (ev) => {
            for (let i = 0; i < 4; i++) {
                Roland.buzzer(0);
                await new Promise((res) => setTimeout(res, 750));
                Roland.buzzer(1);
                await new Promise((res) => setTimeout(res, 750));
            }
            Roland.buzzer();
        }}>Buzzer police</Button
    >
    <!--












            
        -->
{:else}
    <button
        on:click={async () => {
            started = true;
            Roland.init("http://192.168.0.1:5000/io").then(
                () => (inited = true)
            );
            await tick();
        }}>Connect</button
    >
{/if}

<style>
    #color {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: auto;
        border: black solid;
    }
    h1,
    h2,
    h3 {
        text-align: center;
    }
    #debug {
        white-space: nowrap;
        overflow: hidden;
    }
    button {
        margin: auto;
        display: block;
        font: inherit;
        font-size: 3em;
    }
    label {
        margin-top: 1em;
        font-size: 2em;
        text-align: center;
    }
    .slider {
        margin: auto;
        display: block;
        width: 300px;
    }
    #slider-container {
        display: flex;
        margin: auto;
        width: fit-content;
    }
</style>
