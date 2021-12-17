function createWebSocket() {
  const headers = {
    action: 'Logged in',
    admin: false,
    firstLogin: false,
    logins: null,
    password: 'ccd1c0444ad4a905d4526bea635710ef2ee21c0e',
    user_id: 737800,
    username: 'azevedo',
  };

  const websocket = new WebSocket('wss://duel.duelingbook.com:8443');

  websocket.onopen = () => {
    console.log('connected');
  };
  websocket.onmessage = (message) => {
    console.log(message.data);
  };
}
createWebSocket();

function connectHandler() {
  Send({
    action: 'Connect',
    username: username,
    password: password,
    db_id: db_id,
    session: session_id,
    administrate: administrate,
    version: VERSION,
    capabilities: '',
    remember_me: remember_me,
    connect_time: connect_time,
    fingerprint: 0,
    html_client: true,
    mobile: mobile,
    browser: getBrowser(),
    platform: getPlatform(),
    degenerate: degenerate,
    revamped: revamped,
  });
  got_heartbeat = true;
  heartbeat_timer.start();
  timeout_timer.start();
}
