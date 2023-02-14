import { t } from '$lib/trpc/t';
import { z } from 'zod';
import redisClient from '$lib/redis';

export const image = t.router({
	add: t.procedure.input(z.string()).mutation(async ({ input }) => {
		await redisClient.connect();
		const res = await redisClient.sAdd('visible', input);
		return res;
	}),
	remove: t.procedure.input(z.string()).mutation(async ({ input }) => {
		await redisClient.connect();
		const res = await redisClient.sRem('visible', input);
		return res;
	}),
	show: t.procedure.input(z.string()).mutation(async ({ input }) => {
		await redisClient.connect();
		const res = await redisClient.sMove('hidden', 'visible', input);
		return res;
	}),
	hide: t.procedure.input(z.string()).mutation(async ({ input }) => {
		await redisClient.connect();
		const res = await redisClient.sMove('visible', 'hidden', input);
		return res;
	}),
	getAll: t.procedure.input(z.string()).query(async () => {
		await redisClient.connect();
		const res = await redisClient.sUnion(['visible', 'hidden']);
		return res;
	}),
	getVisible: t.procedure.input(z.string()).query(async () => {
		await redisClient.connect();
		const res = await redisClient.sMembers('visible');
		return res;
	}),
	getHidden: t.procedure.input(z.string()).query(async () => {
		await redisClient.connect();
		const res = await redisClient.sMembers('hidden');
		return res;
	})
});
