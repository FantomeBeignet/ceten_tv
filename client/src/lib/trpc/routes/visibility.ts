import { t } from '$lib/trpc/t';
import { z } from 'zod';
import redisClient from '$lib/redis';

export const visibility = t.router({
	show: t.procedure.input(z.string()).mutation(async ({ input }) => {
		const res = await redisClient.sMove('hidden', 'visible', input);
		return res;
	}),
	hide: t.procedure.input(z.string()).mutation(async ({ input }) => {
		const res = await redisClient.sMove('visible', 'hidden', input);
		return res;
	})
});
