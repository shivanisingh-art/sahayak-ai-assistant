chrome.runtime.onInstalled.addListener(() => {
  console.log("Sahayak AI Assistant installed!");

  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true
  });
});