import type { Router } from '$lib/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

const url = '/api/trpc';

export function trpc(init?: TRPCClientInit) {
	const client = createTRPCClient<Router>({ url, init });
	if (typeof window === 'undefined') return client;
	if (!browserClient) browserClient = client;
	return browserClient;
}
