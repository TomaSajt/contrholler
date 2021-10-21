<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
</script>

<Button onClick={() => goto("/joystick")}>Joystick</Button>
<Button onClick={() => goto("/joystick?dev=true")}>Joystick dev mode</Button>