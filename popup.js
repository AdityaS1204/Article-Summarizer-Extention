document.getElementById('summarizeBtn').addEventListener("click", () => {
    const result = document.getElementById("result");
    result.textContent = 'summarizing ...';

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (!tab) return;

        chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, (response) => {
            
            if (chrome.runtime.lastError) {
                result.textContent = "Cannot access this page. Try refreshing!";
                console.error(chrome.runtime.lastError.message);
                return;
            }

            if (response && response.text) {
                result.textContent = response.text.slice(0, 300) + "...";
                console.log(response.text);
            } else {
                result.textContent = "NO article text found";
            }
        });
    });
});
