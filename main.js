import { cheerio } from 'https://deno.land/x/cheerio@1.0.4/mod.ts';
// https://www.npmjs.com/package/cheerio

const url = 'https://www.ygoscope.com/playerProfile?player=dragshowbaby';

console.log('Start');
console.time('request');
const response = await fetch(url);
// console.log(response);
console.timeEnd('request');

console.time('get html');
const htmlText = await response.text();

// const htmlText = await Deno.readTextFileSync("./main2.html");
console.timeEnd('get html');

// await Deno.writeTextFile("./main2.html", htmlText);

console.time('parser');
const $ = cheerio.load(htmlText);
console.timeEnd('parser');

const data = $('td')
  .toArray()
  .map((e) => $(e).text().trim().replace('\n', '').replace(/\s+/g, ' '));

const replays = $('td a')
  .toArray()
  .map((e) => $(e).attr())
  .map(({ href }) => href)
  .filter((e) => e.includes('replay?'));

const tableHeader = $('th')
  .toArray()
  .map((e) => $(e).text().trim().toLocaleLowerCase())
  .map((e) => (e === '' ? 'replay' : e))
  .map((e) => (e === 'player deck' ? 'player_deck' : e))
  .map((e) => (e === 'opponent deck' ? 'opponent_deck' : e))
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

console.log(output);
