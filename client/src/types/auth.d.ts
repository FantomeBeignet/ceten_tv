import '@auth/core';

declare module '@auth/core' {
	interface User {
		id: string | null | undefined;
	}
	interface Session {
		user: User;
	}
}
