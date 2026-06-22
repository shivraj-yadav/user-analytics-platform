(function () {
  // ─── Configuration ─────────────────────────────────────
  const API_URL = "http://localhost:5000/api/events";

  // ─── Session Management ────────────────────────────────
  function getSessionId() {
    let sessionId = localStorage.getItem("cf_session_id");

    if (!sessionId) {
      sessionId = crypto.randomUUID
        ? crypto.randomUUID()
        : "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);

      localStorage.setItem("cf_session_id", sessionId);
      console.log(`🆕 New session created: ${sessionId}`);
    }

    return sessionId;
  }

  // ─── Send Event to Backend ─────────────────────────────
  function sendEvent(eventData) {
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(`✅ Event sent: ${eventData.event_type}`);
        }
      })
      .catch((error) => {
        console.warn(`⚠️ Failed to send event: ${error.message}`);
      });
  }

  // ─── Track Page View ───────────────────────────────────
  function trackPageView() {
    const eventData = {
      session_id: getSessionId(),
      event_type: "page_view",
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    sendEvent(eventData);
  }

  // ─── Track Click ───────────────────────────────────────
  function trackClick(event) {
    const eventData = {
      session_id: getSessionId(),
      event_type: "click",
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      x: event.clientX,
      y: event.clientY,
    };

    sendEvent(eventData);
  }

  // ─── Initialize Tracking ───────────────────────────────
  function init() {
    console.log("🔍 CausalFunnel Tracker initialized");

    // Track page view on load
    trackPageView();

    // Track all clicks on the page
    document.addEventListener("click", trackClick);
  }

  // Start tracking when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();