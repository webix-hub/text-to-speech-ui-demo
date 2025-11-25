# Webix UI + OpenAI Text-to-Speech Demo

This repository provides a minimal example of integrating the **Webix UI** library with the **OpenAI Text-to-Speech API**.
The implementation is described in detail in the article in Webix Blog, including prompts that helped to build the UI and improvements made by authors.
**[Integrating OpenAI APIs with Webix: How to Create a Text-to-Speech App in 30 Minutes](https://blog.webix.com/integrating-openai-apis-with-webix/)**


## Overview

The demo illustrates:

* Rendering a basic interface with Webix
* Sending text input to the OpenAI Text-to-Speech API
* Playing the generated audio in the browser

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/webix-hub/text-to-speech-ui-demo.git
   ```
2. Add your OpenAI API key at constants.js:
    ```js
    const API_KEY = "YOUR_OPENAI_API_KEY";
    ```
3. Open `index.html` (serving the project with a local web server).

## License

MIT License.