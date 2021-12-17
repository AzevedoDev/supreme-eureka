import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
import { List, User, RankingT } from './src/utils/types.ts';
import { urlPadronize } from './src/utils/formatters.ts';

const top100 = await JSON.parse(Deno.readTextFileSync('./top100.json'));
const normalizeTop: User[] = top100.results
  .map(
    (
      { entry1, entry2, entry3, entry4, entry5, entry6 }: RankingT,
      index: number
    ) => {
      return {
        position: index + 1,
        username: entry1,
        rating: entry2,
        wins: entry3,
        loses: entry4,
        draws: entry5,
        experience: entry6,
      };
    }
  )
  .slice(0, 2);
console.timeEnd('get html');
try {
  console.time('request');
  const result = await Promise.all(
    normalizeTop.map(async ({ username }, index) => {
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

      console.log('get get table headers');

      const tableHeader = $('th')
        .toArray()
        .map((e) => $(e).text().trim().toLocaleLowerCase())
        .map((e) => (e === '' ? 'replay' : e))
        .map((e) => (e === 'player deck' ? 'playerDeck' : e))
        .map((e) => (e === 'opponent deck' ? 'opponentDeck' : e))
        .filter((e) => e !== 'count' && e !== 'name');

      const headersLength = tableHeader.length;

      const output = data
        .reduce((list: List[], value, index) => {
          const listIndex = Math.floor(index / headersLength);
          const key = tableHeader[index % headersLength];

          list[listIndex] = list[listIndex] || {};
          list[listIndex][key] = value;
          list[listIndex][key] === 'Replay' &&
            (list[listIndex][key] = replays[listIndex]);

          return list;
        }, [])
        .splice(0, 2);

      return { ...normalizeTop[index], matches: output };
    })
  );
  console.timeEnd('request');
  console.log(result);
} catch (error) {
  console.error(error);
}

// pesquisa um dia
// console.log(
//   normalizeTop.find(({ username }: { username: string }) =>
//     username.includes('Aquino')
//   )
// );
