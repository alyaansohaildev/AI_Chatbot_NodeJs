# AI Chatbot Backend

This repository contains the backend for the **AI Chatbot** project, which is part of the **AI_Chatbot_ReactNative** application. The backend is responsible for managing the communication between the following key components:

- **Ollama Server**: A powerful AI service that processes natural language requests and generates responses.
- **MongoDB**: A NoSQL database used to store and manage data related to user interactions and chatbot sessions.
- **React Native Frontend**: A mobile app that communicates with this backend, enabling users to interact with the chatbot.

## Key Features

- **Ollama Server Communication**: The backend manages the requests to the Ollama server, sending user inputs and receiving AI-generated responses. It ensures smooth communication between the frontend and Ollama, allowing the React Native app to display real-time chatbot responses.
  
- **MongoDB Integration**: The backend interacts with MongoDB to store user data, conversation history, and other relevant information. This allows for data persistence and the ability to track user interactions over time.

- **API for React Native Frontend**: The backend exposes a set of APIs that the React Native mobile app calls to interact with the Ollama server and MongoDB. These APIs handle user input, return AI responses, and manage data storage and retrieval.

**Repository URL for React Native Frontend**
https://github.com/alyaansohaildev/AI_Chatbot_ReactNative.git

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alyaansohaildev/AI_Chatbot_NodeJs.git
