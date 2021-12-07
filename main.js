import { cheerio } from "https://deno.land/x/cheerio@1.0.4/mod.ts";
// https://www.npmjs.com/package/cheerio

// const url = "https://www.ygoscope.com/playerProfile?player=youngest+Thief+II";

// console.time("request");
// const response = await fetch(url);
// console.timeEnd("request");

// console.time("get html");
// const htmlText = await response.text();
// console.timeEnd("get html");

const htmlText = await Deno.readTextFile("./main.html");

console.time("parser");
const $ = cheerio.load(htmlText);
console.timeEnd("parser");

function TableDataMapper(td) {
  // ["whybotherthere", "Swordsoul Tenyi" ...]
  return td.children
    .filter((c) => c.name === "a")
    .filter(Boolean)
    .map((a) => a.children.find((c) => c.type === "text"));
}

const propNames = Array.from($("tbody tr:first-child").children())
  .map((th) => th.children.find((c) => c.type === "text")?.data)
  .filter(Boolean)
  .filter((th) => th !== "Name" && th !== "Count");

const propValues = Array.from($(".table-row-hover"))
  .map((tr) =>
    tr.children
      .filter((node) => node?.type === "tag")
      .map(TableDataMapper)
      .reduce((acc, curval) => acc.concat(curval), [])
  )
  .flat();

const Replays = propValues
  .filter((replay) => replay.data === "Replay")
  .map((c) => c.parent.attribs.href);

const Names = Array.from($(".table-row-hover").children("td")).map(
  ({ type, name, attribs, children }) => {
    const { type: childType, data } = children[0];
    return {
      type,
      name,
      attribs,
      children: { type: childType, data },
    };
  }
);

console.log(Names);
