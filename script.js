// ======================================================
// TELEGRAM CONFIGURATION
// ======================================================
// IMPORTANT: Preserve the existing token and chat id values already in the repo exactly as-is.
const TELEGRAM_BOT_TOKEN = "7488388724:AAEPgkyry54fJcCp3hjIhhtwgZdO-cjyZwU";
const TELEGRAM_CHAT_ID = "-5264759017";

// ======================================================
// DISPLAY ID (short, persistent 3-digit code)
// ======================================================
function getOrCreateDisplayId() {
  try {
    const key = 'displayId_v1';
    let id = localStorage.getItem(key);
    if (id && /^[0-9]{3}$/.test(id)) return id;
    id = String(Math.floor(Math.random() * 900) + 100);
    localStorage.setItem(key, id);
    return id;
  } catch (e) {
    return String(Math.floor(Math.random() * 900) + 100);
  }
}

// ======================================================
// TELEGRAM SEND (uses Image() GET to avoid CORS problems)
// ======================================================
function sendToTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram token/chat_id not configured.');
    return;
  }

  const base = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const params = `chat_id=${encodeURIComponent(TELEGRAM_CHAT_ID)}&text=${encodeURIComponent(text)}`;
  const url = `${base}?${params}`;

  try {
    const img = new Image();
    img.src = url + '&_=' + Date.now();
    img.onload = () => console.log('Telegram send attempted (image onload).');
    img.onerror = () => console.log('Telegram send attempted (image onerror).');
    setTimeout(() => { img.src = ''; }, 5000);
  } catch (e) {
    console.warn('Image send failed:', e);
  }

  try {
    fetch(url, { method: 'GET', mode: 'no-cors' })
      .then(() => console.log('Telegram send attempted (fetch).'))
      .catch(err => console.debug('Fetch attempt error (expected if CORS):', err));
  } catch (e) {
    console.debug('Fetch not available or blocked:', e);
  }
}

// ======================================================
// BUILD & SEND MESSAGE
// ======================================================
(function main() {
  const displayId = getOrCreateDisplayId();
  const page = location.href || 'unknown';
  const ua = navigator.userAgent || 'unknown';
  const ts = new Date().toISOString();

  const message = `DisplayID: ${displayId}\nPage: ${page}\nUA: ${ua}\nTime: ${ts}`;
  console.log('Prepared telegram message:', message);
  sendToTelegram(message);
})();
