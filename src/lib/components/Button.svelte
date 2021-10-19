<script lang="ts">
    export let disabled = false;
    export let color: "blue" | "green" | "yellow" | "red" = "blue";
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
    {disabled}
    on:click={onClick}
>
    <slot />
</button>

<style lang="postcss">
    .btn-blue {
        @apply bg-blue-500;
    }
    .btn-blue:hover {
        @apply bg-blue-700;
    }
    .btn-blue:disabled {
        @apply bg-blue-500;
    }
    .btn-green {
        @apply bg-green-500;
    }
    .btn-green:hover {
        @apply bg-green-700;
    }
    .btn-green:disabled {
        @apply bg-green-500;
    }
    .btn-yellow {
        @apply bg-yellow-500;
    }
    .btn-yellow:hover {
        @apply bg-yellow-700;
    }
    .btn-yellow:disabled {
        @apply bg-yellow-500;
    }
    .btn-red {
        @apply bg-red-500;
    }
    .btn-red:hover {
        @apply bg-red-700;
    }
    .btn-red:disabled {
        @apply bg-red-500;
    }
</style>
