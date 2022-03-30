const text = `${Deno.cwd()}/data/`;
if (text.includes('/data/')) {
  const data = Deno.readTextFileSync(text);
  const result = JSON.parse(data);
  console.log(result);
}

console.log(text);
