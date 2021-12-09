import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
import { Language, minifyHTML } from "https://deno.land/x/minifier/mod.ts";
// https://www.npmjs.com/package/cheerio

// const url = "https://www.ygoscope.com/playerProfile?player=youngest+Thief+II";

console.log("Start");
console.time("request");
// const response = await fetch(url);
// console.log(response);
console.timeEnd("request");

const code = `
<html>
<head>
  <style>
    html {
      margin: 0;
      padding: 0;
    }
  </style>
  <script>
    const x = 23;
    if (x > 20) {
      x--;
    }
    console.log(x);
  </script>
</head>
</html>
`;
console.log(typeof code);
console.time("get html");
// const htmlText = await response.text();
const htmlText = await Deno.readTextFileSync("./main2.html");
console.log(typeof htmlText);
console.timeEnd("get html");

// await Deno.writeTextFile("./main2.html", htmlText);

const texto = await minifyHTML(htmlText.toString());
console.time("parser");
const $ = cheerio.load(texto);
console.timeEnd("parser");

function TableDataMapper(td) {
  // ["whybotherthere", "Swordsoul Tenyi" ...]
  return td.children
    .filter((c) => c.name === "a")
    .filter(Boolean)
    .map((a) => a.children.find((c) => c.type === "text"));
}

const propValues = $(".table-row-hover")
  .toArray()
  .map((tr) =>
    tr.children
      .filter((node) => node?.type === "tag")
      .map(TableDataMapper)
      .flat()
  )
  .flat();

const data = $("td")
  .toArray()
  .map((e) => $(e).text().trim());

const replays = propValues
  .filter((replay) => replay.data === "Replay")
  .map((c) => c.parent.attribs.href);

const header = [
  "Replay",
  "Opponent",
  "Player Deck",
  "Opponent Deck",
  "Result",
  "Duration",
  "Date",
  "Type",
  "Log",
];

const dataWithoutHeader = data.slice(8);

const headersLength = header.length;

const output = dataWithoutHeader
  .reduce((list, value, index) => {
    const listIndex = Math.floor(index / headersLength);
    const key = header[index % headersLength];

    list[listIndex] = list[listIndex] || {};
    list[listIndex][key] = value;
    list[listIndex][key] === "Replay"
      ? (list[listIndex][key] = replays[listIndex])
      : null;
    return list;
  }, [])
  .splice(0, 19);

console.log(output);
// const example = [
//   {
//     Opponent: "whybotherthere",
//     "Player Deck": "Swordsoul Tenyi",
//     "Opponent Deck": "Swordsoul Tenyi Yang Zing",
//     Result: "WON",
//     Duration: "13:45",
//     Date: "05-12-2021",
//     Type: "MATCH",
//     Log: "34473786",
//     Replay: "Replay",
//   },
//   {
//     Opponent: "whybotherthere",
//     "Player Deck": "Swordsoul Tenyi",
//     "Opponent Deck": "Swordsoul Tenyi Yang Zing",
//     Result: "WON",
//     Duration: "13:45",
//     Date: "05-12-2021",
//     Type: "MATCH",
//     Log: "34473786",
//     Replay: "Replay",
//   },
// ];
