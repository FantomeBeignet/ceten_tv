import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	AUTH_SECRET,
	USER_WHITELIST
} from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';
import { router } from '$lib/trpc/router';
import { createContext } from '$lib/trpc/context';

const authorize = (async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/admin')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/auth/signin');
		}
	}
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html
	});
	return result;
}) satisfies Handle;

const url = '/api/trpc';

export const trpcHandle: Handle = createTRPCHandle({ router, url, createContext });

export const handle: Handle = sequence(
	SvelteKitAuth({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		providers: [GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })],
		secret: AUTH_SECRET,
		callbacks: {
			async jwt({ token, profile }) {
				if (profile) {
					token = { ...token, sub: profile.sub };
				}
				return token;
			},
			async session({ session, token }) {
				if (session?.user) {
					const user = { ...session.user, id: token.sub };
					session.user = user;
				}
				return session;
			},
			async signIn({ user }) {
				if (process.env.NODE_ENV === 'development') return true;
				if (USER_WHITELIST.split(';').includes(user.id)) {
					return true;
				}
				return false;
			}
		}
	}),
	authorize,
	trpcHandle
);
