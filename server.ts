import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { output } from './main.ts';

const app = new Application();
const router = new Router();
const response = await JSON.stringify(output);

app.use(async (ctx, next) => {
  await next();

  console.log(`${ctx.request.method} ${ctx.request.url}`);
});

router.get('/', (ctx) => (ctx.response.body = response));

app.use(router.routes());

await app.listen({ port: 9090 });
