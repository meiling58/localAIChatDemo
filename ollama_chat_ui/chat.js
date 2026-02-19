document.addEventListener("DOMContentLoaded", () => {

    // -------------------------------
    // DOM references
    // -------------------------------
    const chatBox = document.getElementById("chat");
    const input = document.getElementById("input");
    const sendBtn = document.getElementById("send");
    const clearBtn = document.getElementById("clear");
    const typingIndicator = document.getElementById("typing");
    const modelSelect = document.getElementById("model");
    const modelInfoBox = document.getElementById("model-info");

    // -------------------------------
    // Model descriptions
    // -------------------------------
    const modelDescriptions = {
        "phi3:latest": `
            <strong>Phi‑3</strong><br>
            • Very fast and lightweight<br>
            • Great for short, simple questions<br>
            • Good for quick facts and small tasks<br><br>
            <em>Best for:</em><br>
            • What is 2 + 2<br>
            • What is the capital of France<br>
            • Summarize this in one sentence<br>
        `,
        "mistral:latest": `
            <strong>Mistral</strong><br>
            • Strong reasoning ability<br>
            • Good balance of speed and quality<br>
            • Handles longer answers well<br><br>
            <em>Best for:</em><br>
            • Explain how photosynthesis works<br>
            • Write a short paragraph about AI safety<br>
            • Compare two programming languages<br>
        `,
        "qwen3:4b": `
            <strong>Qwen 3 (4B)</strong><br>
            • Excellent at code and instructions<br>
            • Very good Markdown formatting<br>
            • Strong logical reasoning<br><br>
            <em>Best for:</em><br>
            • Write a Python function to sort a list<br>
            • Fix this JavaScript bug<br>
            • Explain this error message<br>
        `,
        "llama3:latest": `
            <strong>Llama‑3</strong><br>
            • Very natural language output<br>
            • Great for creative writing<br>
            • Strong general chat model<br><br>
            <em>Best for:</em><br>
            • Write a friendly email<br>
            • Tell me a short story about a robot<br>
            • Help me brainstorm ideas<br>
        `,
        "llama3.2:3b": `
            <strong>Llama‑3.2 (3B)</strong><br>
            • Very small and fast<br>
            • Good for simple tasks<br>
            • Works well on low‑resource machines<br><br>
            <em>Best for:</em><br>
            • Give me a short definition<br>
            • Translate this sentence<br>
            • List three examples of mammals<br>
        `,
        "llama3.2:1b": `
            <strong>Llama‑3.2 (1B)</strong><br>
            • Extremely tiny<br>
            • Very fast<br>
            • Best for trivial tasks<br><br>
            <em>Best for:</em><br>
            • What is 5 + 7<br>
            • Define gravity in one sentence<br>
            • Give me a random fun fact<br>
        `
    };

    // -------------------------------
    // Load models
    // -------------------------------
    async function loadModels() {
        try {
            const res = await fetch("http://127.0.0.1:8000/models");
            const data = await res.json();

            modelSelect.innerHTML = "";

            data.models.forEach(model => {
                const option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });

            const saved = localStorage.getItem("selectedModel");
            if (saved && data.models.includes(saved)) {
                modelSelect.value = saved;
            }

            modelInfoBox.innerHTML =
                modelDescriptions[modelSelect.value] || "No description available.";

            modelSelect.addEventListener("change", () => {
                localStorage.setItem("selectedModel", modelSelect.value);
                modelInfoBox.innerHTML =
                    modelDescriptions[modelSelect.value] || "No description available.";
            });

        } catch (err) {
            modelSelect.innerHTML = `<option>Error loading models</option>`;
            modelInfoBox.innerHTML = "Could not load model list.";
        }
    }

    loadModels();

    // -------------------------------
    // Load chat history
    // -------------------------------
    let history = JSON.parse(localStorage.getItem("chatHistory") || "[]");

    function renderHistory() {
        chatBox.innerHTML = "";

        history.forEach(msg => {
            const cls = msg.role === "user" ? "user" : "ai";
            chatBox.insertAdjacentHTML("beforeend",
                `<div class="bubble ${cls}">${msg.content}</div>`
            );
        });

        chatBox.scrollTop = chatBox.scrollHeight;
    }

    renderHistory();

    function saveHistory() {
        localStorage.setItem("chatHistory", JSON.stringify(history));
    }

    // -------------------------------
    // Clear chat
    // -------------------------------
    clearBtn.onclick = () => {
        if (!confirm("Clear the entire chat history?")) return;

        history = [];
        saveHistory();
        renderHistory();
    };

    // -------------------------------
    // Enter key sends
    // -------------------------------
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") sendBtn.click();
    });

    // -------------------------------
    // MAIN SEND LOGIC (now sends full history)
    // -------------------------------
    sendBtn.onclick = async () => {
        const prompt = input.value.trim();
        if (!prompt) return;
        input.value = "";

        const selectedModel = modelSelect.value;

        // Add user message
        history.push({ role: "user", content: prompt });
        saveHistory();
        renderHistory();

        const bubbleId = "ai-bubble-" + Date.now();
        chatBox.insertAdjacentHTML("beforeend",
            `<div class="bubble ai"><span id="${bubbleId}"></span></div>`
        );

        chatBox.scrollTop = chatBox.scrollHeight;
        typingIndicator.style.display = "block";

        let aiText = "";

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: history
                })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                aiText += chunk;

                document.getElementById(bubbleId)
                    .insertAdjacentHTML("beforeend", chunk);

                chatBox.scrollTop = chatBox.scrollHeight;
            }

        } catch (err) {
            document.getElementById(bubbleId)
                .insertAdjacentHTML("beforeend", `<div>Error: ${err}</div>`);
        }

        typingIndicator.style.display = "none";

        // Save AI response
        history.push({ role: "ai", content: aiText });
        saveHistory();
        renderHistory();
    };

});
