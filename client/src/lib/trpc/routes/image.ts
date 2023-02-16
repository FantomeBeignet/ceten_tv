import { t } from '$lib/trpc/t';
import { z } from 'zod';
import redisClient from '$lib/redis';

export const image = t.router({
	add: t.procedure.input(z.string().uuid()).mutation(async ({ input }) => {
		const res = await redisClient.zadd('visible', '+inf', input);
		return res;
	}),
	remove: t.procedure.input(z.string().uuid()).mutation(async ({ input }) => {	
		const res = await redisClient.zrem('visible', input);
		return res;
	}),
	show: t.procedure.input(z.string().uuid()).mutation(async ({ input }) => {
		const res = await redisClient.zadd('visible', '+inf', input);
		return res;
	}),
	showUntil: t.procedure
		.input(z.object({ uuid: z.string().uuid(), date: z.number().int() }))
		.mutation(async ({ input }) => {
			const res = await redisClient.zadd('visible', input.date, input.uuid);
			return res;
		}),
	hide: t.procedure.input(z.string().uuid()).mutation(async ({ input }) => {
		const res = await redisClient.zadd('visible', '-inf', input);
		return res;
	}),
	getAll: t.procedure.input(z.string().uuid()).query(async () => {
		const res = await redisClient.zrange('visible', 0, -1);
		return res;
	}),
	getVisible: t.procedure.input(z.string().uuid()).query(async () => {
		const now = Date.now();
		const res = await redisClient.zrangebyscore('visible', now, '+inf');
		return res;
	}),
	getHidden: t.procedure.input(z.string().uuid()).query(async () => {
		const now = Date.now();
		const res = await redisClient.zrangebyscore('visible', '-inf', `(${now}`);
		return res;
	})
});
