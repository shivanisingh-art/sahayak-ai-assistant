function getPageContent() {
  return {
    title: document.title,
    url: location.href,
    text: document.body.innerText.slice(0, 15000)
  };
}

function detectElements() {
  const buttons = [...document.querySelectorAll("button")];
  const links = [...document.querySelectorAll("a")];
  const inputs = [...document.querySelectorAll("input, textarea, select")];

  return {
    buttons: buttons.map(el => el.innerText || el.getAttribute("aria-label") || "Button"),
    links: links.map(el => el.innerText || el.href),
    inputs: inputs.map(el => el.placeholder || el.type || el.tagName)
  };
}

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.action === "GET_PAGE_CONTENT") {
      sendResponse(getPageContent());
    }

    if (message.action === "DETECT_ELEMENTS") {
      sendResponse(detectElements());
    }
  }
);