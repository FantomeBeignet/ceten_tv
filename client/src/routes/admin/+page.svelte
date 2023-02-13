<script>
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
</script>

{#if Object.keys($page.data.session || {}).length}
	<h1>Coucou</h1>
{:else}
	<button on:click={signIn}>Sign in</button>
{/if}
