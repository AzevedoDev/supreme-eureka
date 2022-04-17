import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import { urlPadronize } from './src/utils/formatters.ts';
import { getTopFromDB } from './wsclientside.ts';

try {
  const organizePlayers = ({ results }) =>
    results
      .map(({ entry1, entry2, entry3, entry4, entry5, entry6 }, index) => {
        return {
          position: index + 1,
          username: entry1,
          rating: entry2,
          wins: entry3,
          loses: entry4,
          draws: entry5,
          experience: entry6,
          lastUpdate: new Date().toISOString(),
        };
      })
      .splice(0, 150);

  const top = await getTopFromDB().then(organizePlayers);

  console.time('request');
  const result = await Promise.all(
    top.map(async ({ username }, index) => {
      console.log(
        `--------------------${username.toUpperCase()}:${
          index + 1
        }--------------------`
      );
      const url = `https://www.ygoscope.com/playerProfile?player=${urlPadronize(
        username
      )}`;
      const htmlNormalized = await (await fetch(url)).text();
      const $ = cheerio.load(htmlNormalized);
      console.log('get data from fetch');
      const data = $('td')
        .toArray()
        .map((e) => $(e).text().trim().replace('\n', '').replace(/\s+/g, ' '));

      console.log('get replays from data');
      const replays = $('td a')
        .toArray()
        .map((e) => $(e).attr())
        .map(({ href }) => href)
        .filter((e) => e.includes('replay?'));

      console.log('get table headers');

      const tableHeader = $('th')
        .toArray()
        .map((e) => $(e).text().trim().toLocaleLowerCase())
        .map((e) => (e === '' ? 'replay' : e))
        .map((e) => (e === 'player deck' ? 'playerDeck' : e))
        .map((e) => (e === 'opponent deck' ? 'opponentDeck' : e))
        .filter((e) => e !== 'count' && e !== 'name');

      const headersLength = tableHeader.length;

      const output = data
        .reduce((list, value, index) => {
          const listIndex = Math.floor(index / headersLength);
          const key = tableHeader[index % headersLength];

          list[listIndex] = list[listIndex] || {};
          list[listIndex][key] = value;
          list[listIndex][key] === 'Replay' &&
            (list[listIndex][key] = replays[listIndex]);

          return list;
        }, [])
        .splice(0, 19);

      return { ...top[index], matches: output };
    })
  );
  console.timeEnd('request');
  function writeJson(path, data) {
    try {
      Deno.writeTextFileSync(path, JSON.stringify(data));
      return 'Written to ' + path;
    } catch (e) {
      return e.message;
    }
  }
  const text = `${Deno.cwd()}/data/`;

  if (!text.includes('/data/')) {
    Deno.mkdirSync(`${Deno.cwd()}/data`);
  }
  writeJson(`./data/results.json`, result);
} catch (error) {
  console.error(error);
}

// pesquisa um dia
// console.log(
//   top.find(({ username }: { username: string }) =>
//     username.includes('Aquino')
//   )
// );
