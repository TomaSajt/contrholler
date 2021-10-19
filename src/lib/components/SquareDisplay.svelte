<script lang="ts">
    export let on = false;
    export let letter = "";
</script>

<div
    style="aspect-ratio: 1 / 1;"
    class="grid place-items-center "
    class:bg-blue-500={on}
    class:bg-red-500={!on}
>
    <span class="text-[13vmin]">
        {letter}
    </span>
</div>
