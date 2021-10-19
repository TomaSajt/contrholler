<script lang="ts">
    import SquareDisplay from "$lib/components/SquareDisplay.svelte";

    import * as Roblib from "$lib/roblib";
    const debug = true;
    let initPromise = debug
        ? Promise.resolve()
        : Roblib.init("http://192.168.0.1:5000");
    let speed = 50;
    let started = false;
    const speeds: { left: number; right: number }[][] = [
        [
            { left: -0.5, right: 1 },
            { left: 1, right: 1 },
            { left: 1, right: -0.5 },
        ],
        [
            { left: -1, right: 1 },
            { left: 0, right: 0 },
            { left: 1, right: -1 },
        ],
        [
            { left: 0.5, right: -1 },
            { left: -1, right: -1 },
            { left: -1, right: 0.5 },
        ],
    ];
    let keys = {
        w: false,
        s: false,
        a: false,
        d: false,
    };
    $: axes = {
        x: (keys.s ? 1 : 0) - (keys.w ? 1 : 0),
        y: (keys.d ? 1 : 0) - (keys.a ? 1 : 0),
    };
    $: normalSpeed = speeds[axes.x + 1][axes.y + 1];
    $: if (started) {
        normalSpeed;
        sendUpdate();
    }
    function sendUpdate() {
        if (!debug) {
            Roblib.move({
                left: normalSpeed.left * speed,
                right: normalSpeed.right * speed,
            });
        }
    }
</script>

<svelte:window
    on:keydown={(ev) => {
        let key = ev.key;
        if (key in keys) {
            keys[key] = true;
        }
    }}
    on:keyup={(ev) => {
        let key = ev.key;
        if (key in keys) {
            keys[key] = false;
        }
    }}
/>
{#await initPromise.then(() => (started = true))}
    <div class="absolute inset-0 m-auto w-[max-content] h-[max-content]">
        <p class="text-center text-4xl font-bold mb-3">Loading...</p>
        <progress class="w-[500px]" />
    </div>
{:then _}
    {#if debug}
        <p>keys: {JSON.stringify(keys)}</p>
        <p>axes: {JSON.stringify(axes)}</p>
    {/if}
    <div class="absolute inset-0 m-auto w-[max-content] h-[max-content] ">
        <div class="grid grid-cols-3 gap-3 w-[90vmin]">
            <div class="square" />
            <SquareDisplay on={keys.w} letter="W" />
            <div class="square" />
            <SquareDisplay on={keys.a} letter="A" />
            <SquareDisplay on={keys.s} letter="S" />
            <SquareDisplay on={keys.d} letter="D" />
        </div>
    </div>
{:catch err}
    {err}
{/await}
