export function getTopFromDB() {
  return new Promise<any>((resolve, reject) => {
    try {
      const websocket = new WebSocket('ws://duel.duelingbook.com:8443');

      const connect = JSON.stringify({
        action: 'Connect',
        username: 'azevedo',
        password: '5480cd5648e39c9adfcdeedfab4ed2a4b6adbda8',
        db_id: 'w6q7mw05yb90xf2u0ghf6trf7r62un38',
        session: 'r6pi9pabcuty18mo62d4n1y9kkntjbae',
        administrate: false,
        version: 620,
        capabilities: '',
        remember_me: 0,
        connect_time: 0,
        fingerprint: 0,
        html_client: true,
        mobile: false,
        browser: 'Chrome',
        platform: 'PC',
        degenerate: false,
        revamped: true,
      });

      const enterToRanking = JSON.stringify({
        action: 'Ranking by rating',
        matches: true,
        period: 'current',
        format: 'ar',
        location: '',
      });

      websocket.onopen = () => {
        console.log('connected');
        console.log('Enter to DB');
        websocket.send(connect);
        console.log('Enter to Ranking');
        websocket.send(enterToRanking);
      };
      websocket.onmessage = (message) => {
        const convertedResult = JSON.parse(message.data);
        if (convertedResult.action === 'Ranking by rating') {
          resolve(convertedResult);
          websocket.close();
        }
      };
      websocket.onclose = () => {
        console.log('Closed connection');
      };
    } catch (e) {
      reject(e);
    }
  });
}
