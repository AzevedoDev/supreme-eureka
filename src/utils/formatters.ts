export function urlPadronize(username: string) {
  return username
    .replaceAll(' ', '+')
    .replaceAll("'", '%27')
    .replaceAll('*', '%2A');
}

export function tableHeader(arr: string[]) {
  return arr
    .map((e) => (e === '' ? 'replay' : e))
    .map((e) => (e === 'player deck' ? 'playerDeck' : e))
    .map((e) => (e === 'opponent deck' ? 'opponentDeck' : e))
    .filter((e) => e !== 'count' && e !== 'name');
}
