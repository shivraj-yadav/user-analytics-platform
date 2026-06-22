(function () {

  // ─── Configuration ──────────────────────────────────────
  const CONFIG = {
    API_URL: window.location.hostname === "localhost"
      ? "http://localhost:5000/api/events"
      : "https://user-analytics-platform-72v0.onrender.com/api/events",

    SESSION_KEY:    "cf_session_id",
    DEBUG:          true,
    RETRY_LIMIT:    3,
    RETRY_DELAY_MS: 1000,
  };

  // ─── Logger ─────────────────────────────────────────────
  const log = {
    info:   (msg) => CONFIG.DEBUG && console.log(`[CF Tracker] ℹ️  ${msg}`),
    success:(msg) => CONFIG.DEBUG && console.log(`[CF Tracker] ✅ ${msg}`),
    warn:   (msg) => CONFIG.DEBUG && console.warn(`[CF Tracker] ⚠️  ${msg}`),
    error:  (msg) => CONFIG.DEBUG && console.error(`[CF Tracker] ❌ ${msg}`),
  };

  // ─── Session Management ──────────────────────────────────
  function getSessionId() {
    try {
      let sessionId = localStorage.getItem(CONFIG.SESSION_KEY);

      if (!sessionId) {
        sessionId = crypto.randomUUID
          ? crypto.randomUUID()
          : "sess_" +
            Date.now() +
            "_" +
            Math.random().toString(36).substr(2, 9);

        localStorage.setItem(CONFIG.SESSION_KEY, sessionId);
        log.info(`New session created: ${sessionId}`);
      }

      return sessionId;
    } catch (error) {
      log.error(`Session error: ${error.message}`);
      return "fallback_" + Date.now();
    }
  }

  // ─── Send Event with Retry ───────────────────────────────
  function sendEvent(eventData, retryCount = 0) {
    fetch(CONFIG.API_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(eventData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          log.success(`Event sent: ${eventData.event_type}`);
        } else {
          log.warn(`Event rejected: ${data.message}`);
        }
      })
      .catch((error) => {
        if (retryCount < CONFIG.RETRY_LIMIT) {
          log.warn(`Retry ${retryCount + 1} for: ${eventData.event_type}`);
          setTimeout(
            () => sendEvent(eventData, retryCount + 1),
            CONFIG.RETRY_DELAY_MS
          );
        } else {
          log.error(`Failed after ${CONFIG.RETRY_LIMIT} retries: ${error.message}`);
        }
      });
  }

  // ─── Build Base Event ────────────────────────────────────
  function buildBaseEvent(type) {
    return {
      session_id: getSessionId(),
      event_type: type,
      page_url:   window.location.href,
      timestamp:  new Date().toISOString(),
    };
  }

  // ─── Track Page View ─────────────────────────────────────
  function trackPageView() {
    const event = buildBaseEvent("page_view");
    log.info(`Tracking page_view: ${event.page_url}`);
    sendEvent(event);
  }

  // ─── Track Click ─────────────────────────────────────────
  function trackClick(e) {
    const event = {
      ...buildBaseEvent("click"),
      x: Math.round(e.clientX),
      y: Math.round(e.clientY),
    };
    log.info(`Tracking click at (${event.x}, ${event.y})`);
    sendEvent(event);
  }

  // ─── Initialize ──────────────────────────────────────────
  function init() {
    log.info("CausalFunnel Tracker initialized");
    trackPageView();
    document.addEventListener("click", trackClick);
    log.info("Event listeners attached");
  }

  // Start when DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();