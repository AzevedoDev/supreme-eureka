import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

const firebaseConfig = {
  apiKey: 'AIzaSyC0XgWP0vnvAvQEC81rQQo2YQYTg23b9wA',
  authDomain: 'ygohrbr.firebaseapp.com',
  projectId: 'ygohrbr',
  storageBucket: 'ygohrbr.appspot.com',
  messagingSenderId: '344419463175',
  appId: '1:344419463175:web:f339b5243861f09d3a3aa2',
};

const app = initializeApp(firebaseConfig);
console.log(firebaseApp);
// const app = new Application();
// const router = new Router();
// const response = await JSON.stringify(output);

// app.use(async (ctx, next) => {
//   await next();

//   console.log(`${ctx.request.method} ${ctx.request.url}`);
// });

// router.get('/', (ctx) => (ctx.response.body = response));

// app.use(router.routes());

// await app.listen({ port: 9090 });

// const { data, error } = await supabase.from('players');
