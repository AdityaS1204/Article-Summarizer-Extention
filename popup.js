document.getElementById('settingsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

document.getElementById('summarizeBtn').addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const summaryType = document.getElementById("summary-type").value;

    resultDiv.innerHTML = '<div class="spinner"></div>';

    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            resultDiv.innerHTML = "Please add your API key from the settings.";
            console.error("Gemini API Key missing in storage.");
            return;
        }

        console.log("Found API Key, proceeding with extraction...");

        // getting page text from content.js
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab) {
                resultDiv.textContent = "Error: No active tab found.";
                return;
            }

            chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, async (response) => {
                if (chrome.runtime.lastError) {
                    resultDiv.textContent = "Cannot access this page. Try refreshing!";
                    console.error("Message error:", chrome.runtime.lastError.message);
                    return;
                }

                if (!response || !response.text) {
                    resultDiv.textContent = "No article text found on this page.";
                    console.warn("Content script returned no text.");
                    return;
                }

                console.log("Text extracted successfully. Length:", response.text.length);

                try {
                    const summary = await getGeminiSummary(response.text, summaryType, geminiApiKey);
                    console.log("Gemini Response received:", summary);
                    resultDiv.textContent = summary;
                } catch (error) {
                    console.error("Gemini API Error:", error);
                    resultDiv.textContent = "Failed to generate summary: " + error.message;
                }
            });
        });
    });
});

async function getGeminiSummary(rawText, summaryType, geminiApiKey) {
    const max = 20000;
    const text = rawText.length > max ? rawText.slice(0, max) + "..." : rawText;

    const lowerType = summaryType.toLowerCase();
    const promptMap = {
        brief: `summarize in 2-3 sentences:\n\n${text}`,
        detailed: `provide a detailed summary of the following text:\n\n${text}`,
        "bullet-points": `summarize in 7-8 bullet points (start each line with "- "):\n\n${text}`,
    };

    const prompt = promptMap[lowerType] || promptMap.brief;
    console.log("Prepared prompt for type:", lowerType);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Response not OK:", response.status, errorData);
        throw new Error(errorData.error?.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const summary = data.candidates?.[0].content?.parts?.[0].text;

    if (!summary) {
        console.error("Unexpected API structure:", data);
        return "No summary generated (check console for API response)";
    }

    return summary;
}

document.getElementById("copy-btn").addEventListener("click", () => {
    const resultDiv = document.getElementById("result");
    const copyBtn = document.getElementById("copy-btn");

    navigator.clipboard.writeText(resultDiv.textContent).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";

        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
});