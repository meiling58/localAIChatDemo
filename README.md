# Local AI Chat Demo
This is a local, multi‑turn, streaming AI chat with model switching (including phi3, mistral, qwen3 and llama3) 
and a polished UI(can switch to chatGPT, discord, window-fluent and iMessage).

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