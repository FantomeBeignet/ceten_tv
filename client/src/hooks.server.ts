import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, USER_WHITELIST } from '$env/static/private';

export const handle = SvelteKitAuth({
	providers: [GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })],
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
			if (USER_WHITELIST.split(';').includes(user.id)) {
				return true;
			}
			return false;
		}
	}
});
