<script lang="ts">
    import pannable from "$lib/actions/pannable";
    export const deadAreas = {
        outer: 0.8,
        inner: 0.22,
    };
    export let debug = false;
    let axes = {
        x: 0,
        y: 0,
    };
    //Axes converted to polar form
    $: polar = {
        angle: Math.atan2(axes.y, axes.x),
        arg: Math.sqrt(axes.x * axes.x + axes.y * axes.y),
    };
    $: clampedPolar = {
        angle: polar.angle,
        arg: Math.min(1, polar.arg),
    };
    $: clampedAxes = {
        x: clampedPolar.arg * Math.cos(clampedPolar.angle),
        y: clampedPolar.arg * Math.sin(clampedPolar.angle),
    };

    $: deadPolar = {
        angle: clampedPolar.angle,
        arg:
            clampedPolar.arg < deadAreas.inner
                ? 0
                : clampedPolar.arg > deadAreas.outer
                ? 1
                : (clampedPolar.arg - deadAreas.inner) /
                  (deadAreas.outer - deadAreas.inner),
    };
    $: runOnChange(deadPolar);
    function runOnChange(_: any) {
        onChange(deadPolar);
    }
    export let onChange: (newPolar: typeof deadPolar) => any = () => {};
    function moveStick(ev: { detail: { sx: number; sy: number } }) {
        axes = { x: 2 * ev.detail.sx - 1, y: 1 - 2 * ev.detail.sy };
    }
    function resetStick() {
        axes = { x: 0, y: 0 };
    }
</script>

<div
    use:pannable
    on:panstart={moveStick}
    on:panmove={moveStick}
    on:panend={resetStick}
    class="w-full rounded-full relative ring-red-900 ring-8"
    style="aspect-ratio: 1 / 1;
    background-image: radial-gradient(
            circle at center center,
            rgb(252, 252, 252),
            rgb(82, 82, 82)
        );"
>
    {#if debug}
        <div class="disk bg-red-500" style="width: 100%;" />
        <div
            class="disk bg-green-500"
            style="width: {100 * deadAreas.outer}%;"
        />
        <div class="disk bg-red-500" style="width: {100 * deadAreas.inner}%;" />
    {/if}
    <div
        class="disk w-1/5 "
        style="
            background-image: radial-gradient(circle at center center, #222, #000);
            top: calc(50% * {1 - clampedAxes.y});
            left: calc(50% * {1 + clampedAxes.x});"
    />
</div>

<style lang="postcss">
    .disk {
        aspect-ratio: 1 / 1;
        @apply absolute select-none rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none;
    }
</style>
