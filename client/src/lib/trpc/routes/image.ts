import { t } from '$lib/trpc/t';
import { z } from 'zod';
import redisClient from '$lib/redis';

export const image = t.router({
	add: t.procedure.input(z.string()).mutation(async ({ input }) => {
		const res = await redisClient.sadd('visible', input);
		return res;
	}),
	remove: t.procedure.input(z.string()).mutation(async ({ input }) => {
		const res = await redisClient.srem('visible', input);
		return res;
	}),
	show: t.procedure.input(z.string()).mutation(async ({ input }) => {
		const res = await redisClient.smove('hidden', 'visible', input);
		return res;
	}),
	hide: t.procedure.input(z.string()).mutation(async ({ input }) => {
		const res = await redisClient.smove('visible', 'hidden', input);
		return res;
	}),
	getAll: t.procedure.input(z.string()).query(async () => {
		const res = await redisClient.sunion(['visible', 'hidden']);
		return res;
	}),
	getVisible: t.procedure.input(z.string()).query(async () => {
		const res = await redisClient.smembers('visible');
		return res;
	}),
	getHidden: t.procedure.input(z.string()).query(async () => {
		const res = await redisClient.smembers('hidden');
		return res;
	})
});
