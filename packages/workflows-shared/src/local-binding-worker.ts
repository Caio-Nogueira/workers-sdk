import { WorkflowBinding } from "./binding";
import type { Env } from "./binding";

export { Engine } from "./engine";

export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		const binding = new WorkflowBinding(env);

		switch (url.pathname) {
			case "/create": {
				const body = await request.json();
				const result = await binding.create(
					body as WorkflowInstanceCreateOptions<unknown>
				);
				return Response.json({ result: { id: result.id } });
			}
			case "/get": {
				const body = (await request.json()) as { id: string };
				const result = await binding.get(body.id);
				return Response.json({ result: { id: result.id } });
			}
			case "/createBatch": {
				const body = await request.json();
				const result = await binding.createBatch(
					body as WorkflowInstanceCreateOptions<unknown>[]
				);
				return Response.json({ result: result.map((r) => ({ id: r.id })) });
			}
			case "/status": {
				const body = (await request.json()) as { id: string };
				const instance = await binding.get(body.id);
				return Response.json({ result: await instance.status() });
			}
			case "/send-event": {
				const body = (await request.json()) as {
					id: string;
					payload: unknown;
					type: string;
				};
				const instance = await binding.get(body.id);
				await instance.sendEvent(body as { payload: unknown; type: string });
				return Response.json({});
			}
			case "/resume": {
				const body = (await request.json()) as { id: string };
				const instance = await binding.get(body.id);
				await instance.resume();
				return Response.json({});
			}
			case "/pause": {
				const body = (await request.json()) as { id: string };
				const instance = await binding.get(body.id);
				await instance.pause();
				return Response.json({});
			}
			case "/restart": {
				const body = (await request.json()) as { id: string };
				const instance = await binding.get(body.id);
				await instance.restart();
				return Response.json({});
			}
			case "/terminate": {
				const body = (await request.json()) as { id: string };
				const instance = await binding.get(body.id);
				await instance.terminate();
				return Response.json({});
			}
			default:
				return new Response("Not implemented", { status: 501 });
		}
	},
};
