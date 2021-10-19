/// <reference types="@sveltejs/kit" />
declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        [other: string]: unknown;
    };
}