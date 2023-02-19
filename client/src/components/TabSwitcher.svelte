<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let tabNames: string[] = [];
	export let tabs: ComponentType[] = [];

	let currentTabIndex = 0;

	const setCurrentTabIndex = (n: number) => {
		currentTabIndex = n;
	};
</script>

<div class="flex flex-col items-center justify-center gap-12 p-16">
	<nav
		class="group flex flex-row items-center justify-center divide-x-2 divide-gray-700 rounded-md border-2 border-gray-700"
	>
		{#each tabNames as tabName, tabIndex}
			{#if tabIndex === currentTabIndex}
				<button class="flex items-center justify-center bg-gray-700 px-4 py-3">{tabName}</button>
			{:else}
				<button
					class="flex items-center justify-center px-4 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
					on:click={() => setCurrentTabIndex(tabIndex)}>{tabName}</button
				>
			{/if}
		{/each}
	</nav>
	<div class="flex items-center justify-center">
		<svelte:component this={tabs[currentTabIndex]} />
	</div>
</div>
