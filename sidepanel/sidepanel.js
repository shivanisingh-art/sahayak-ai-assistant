async function getCurrentPage() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  if (!tab?.id || !/^https?:/.test(tab.url || "")) {
    throw new Error("Please open a normal website first.");
  }

  return await chrome.tabs.sendMessage(
    tab.id,
    { action: "GET_PAGE_CONTENT" }
  );
}

const output = document.getElementById("output");

document.getElementById("summarize")
  .addEventListener("click", async () => {
    try {
      output.innerText = "Reading webpage...";

      const page = await getCurrentPage();

      output.innerText =
        "Page title: " + page.title +
        "\n\nPage content:\n" + page.text;

    } catch (error) {
      output.innerText = error.message;
    }
  });document.getElementById("send")
  .addEventListener("click", async () => {
    const question = document.getElementById("question").value.trim();

    if (!question) {
      output.innerText = "Please type a question first.";
      return;
    }

    try {
      output.innerText = "Sahayak is thinking...";

      const page = await getCurrentPage();
      const answer = await askAI(question, page.text);

      output.innerText = answer;
    } catch (error) {
      output.innerText = error.message;
    }
  });
  document.getElementById("saveKey")
  .addEventListener("click", async () => {
    const apiKey = document.getElementById("apiKey").value.trim();

    if (!apiKey) {
      output.innerText = "Please enter your API key.";
      return;
    }

    await chrome.storage.local.set({ apiKey: apiKey });

    output.innerText = "API key saved successfully!";
    document.getElementById("apiKey").value = "";
  });

  document.getElementById("translate")
  .addEventListener("click", async () => {
    try {
      output.innerText = "Translating webpage...";

      const page = await getCurrentPage();

      const translation = await askAI(
        "Translate this webpage content into Hindi. Keep the meaning clear and accurate.",
        page.text
      );

      output.innerText = translation;

    } catch (error) {
      output.innerText = error.message;
    }
  });

  document.getElementById("detect")
  .addEventListener("click", async () => {
    try {
      output.innerText = "Detecting webpage elements...";

      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      });

      const elements = await chrome.tabs.sendMessage(
        tab.id,
        { action: "DETECT_ELEMENTS" }
      );

      output.innerText =
        "BUTTONS:\n" + elements.buttons.join("\n") +
        "\n\nLINKS:\n" + elements.links.join("\n") +
        "\n\nINPUT FIELDS:\n" + elements.inputs.join("\n");

    } catch (error) {
      output.innerText = error.message;
    }
  });

  document.getElementById("approveEmail")
  .addEventListener("click", async () => {
    const to = document.getElementById("emailTo").value.trim();
    const subject = document.getElementById("emailSubject").value.trim();
    const body = document.getElementById("emailBody").value.trim();

    if (!to || !subject || !body) {
      output.innerText = "Please fill in all email fields.";
      return;
    }

    const approved = confirm(
      "Do you approve opening this email draft?"
    );

    if (!approved) {
      output.innerText = "Email action cancelled.";
      return;
    }

    const mailto =
      "mailto:" + encodeURIComponent(to) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailto;

    document.getElementById("approvalStatus").innerText =
      "Email draft opened. Review it and send it yourself.";
  });