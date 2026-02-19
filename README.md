# Local AI Chat Demo
This is a local, multi‑turn, streaming AI chat with model switching (including phi3, mistral, qwen3 and llama3) 
and a polished UI(can switch to chatGPT, discord, window-fluent and iMessage).

<details><summary>Screen shot of Local AI Chat</summary>

![Local AI Chat](https://github.com/meiling58/localAIChatDemo/blob/main/localAIchat.png)
</details>

<details><summary>Project Structure</summary>

```batch
localAIChatDemo/    # Root directory of the project
│   .gitignore      # Git ignore file
│   README.md       # Project documentation
└───ollama_chat_ui  # Directory containing the chat UI files
    │   index.html  # Main HTML file for the chat UI
    │   main.py     # Python script for the chat functionality
    │   requirements.txt        # Python dependencies
    |   chat.js                 # JavaScript file for chat interactions
    │   style_chatGPT.css       # CSS file for chatGPT style
    │   style_discord.css       # CSS file for discord style
    │   style_imessage.css      # CSS file for iMessage style
    │   style_v1.css            # CSS file for original style
    │   style_window_fluent.css # CSS file for window fluent style
    |   run_local_ai.bat     # Batch file to run the local AI chat application

```
</details>

<details><summary>Usage Instructions</summary>

1. Clone the repository.
2. Open the project in your preferred code editor, like VS Code, PyCharm, or Jupyter Notebook.
3. Navigate to the `ollama_chat_ui` directory in your terminal.
4. Install the required dependencies using pip:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the `main.py` script to start the chat application:
</details>

<details><summary>Project Key Features</summary>

**Key features of this project include:**

- About UI:
  - model switching (On APP) : Users can switch between different AI models (phi3, mistral, qwen3, and llama3) for their chat interactions.
  - UI switching (On index.html): Users can choose from various UI styles, including chatGPT, discord, window-fluent, and iMessage, to customize their chat experience.
- About setup workflow:
  - Bat file start (production mode): A convenient batch file (`run_local_ai.bat`) is provided to quickly launch the local AI chat application without needing to run the Python script manually.
  - PyCharm/VsCode (Developer mode): The project is compatible with popular code editors like PyCharm and VS Code, allowing developers to easily modify and enhance the chat application.
  - **Note: do not run both modes at the same time, otherwise there will be port conflict.**
</details>

<details><summary>What need to know before using this project</summary>

**What you need to know before using this project:**
- This project is designed for local use and does not require an internet connection, making it ideal for users who want to experience AI chat without relying on cloud services.
- Need to install ollama and set up the local AI models (phi3, mistral, qwen3, and llama3) before running the chat application. Click [Here](https://github.com/meiling58/AI#llama--ollama) for more information.
- The chat application uses python/fastapi for the backend and HTML/CSS/JavaScript for the frontend, providing a seamless and interactive user experience.
</details>

