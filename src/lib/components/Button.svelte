<script lang="ts">
    export let disabled = false;
    export let color: "blue" | "green" | "yellow" | "red" | "gray" = "blue";
    export let onClick: (
        this: HTMLButtonElement,
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) => any = () => {};
</script>

<button
    class="cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none disabled:cursor-auto disabled:opacity-75"
    class:btn-blue={color === "blue"}
    class:btn-green={color === "green"}
    class:btn-yellow={color === "yellow"}
    class:btn-red={color === "red"}
    class:btn-gray={color === "gray"}
    {disabled}
    on:click={onClick}
>
    <slot />
</button>

<style lang="postcss">
    .btn-blue {
        background-color: #11F;
    }
    .btn-blue:hover {
        background-color: #22F;
    }
    .btn-gray {
        @apply bg-gray-500;
    }
    .btn-gray:hover {
        @apply bg-gray-700;
    }
    .btn-green {
        background-color: #0F0;
    }
    .btn-green:hover {
        background-color: #2F2;
    }    .btn-yellow {
        @apply bg-yellow-500;
    }
    .btn-yellow:hover {
        @apply bg-yellow-700;
    }
    .btn-red {
        background-color: #F00;
    }
    .btn-red:hover {
        background-color: #F22;
    }
</style>
