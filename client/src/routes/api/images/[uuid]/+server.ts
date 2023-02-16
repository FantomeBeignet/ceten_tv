import type { RequestHandler } from './$types';
import fs from 'node:fs';
import path from 'node:path'
import sharp from 'sharp';
import { json } from '@sveltejs/kit';
import redisClient from '$lib/redis';

export const GET = (async ({ params }) => {
	const uuid = params.uuid;
	const file = fs.readFileSync(`/app/images/${uuid}.webp`);
	return new Response(file);
}) satisfies RequestHandler;

export const POST = (async ({ params, request }) => {
	const uuid = params.uuid;
	const formData = await request.formData();
	const imageName = (formData.get('image') as File).name;
	const image = await (formData.get('image') as File).arrayBuffer();
	await sharp(Buffer.from(image)).webp({ nearLossless: true }).toFile(`/app/images/${uuid}.webp`);
	await redisClient.hset('names', uuid, path.parse(imageName).name);
	await redisClient.sadd('visible', uuid)
	return json({ result: 'ok' });
}) satisfies RequestHandler;
