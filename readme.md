# NodeJS (Express JS) TypeScript API Project

This project demonstrates a Node.js (Express JS) application with TypeScript that uses Axios for making HTTP requests to an external API, caches data, and saves it to a database for Mr Scrapper Assessment Test.

## Features
- Implement Gemini AI to assist scraping
- REST API to send data from BE into FE

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ilhamsg7/mrscraper-assessment-test
   cd mrscraper-assessment-test
   ```
2. Install dependency in each folder mrscraper-assessment-test-backend and scraper-frontent
    ```bash
    npm install
   ```
3. Copy .env.example to .env in mrscraper-assessment-test-backend
    ```bash
        cp .env.example .env
    ```
4. Setup your Gemini API Key in .env file
    ```
        GEMINI_API_KEY="your api key"
    ```
5. To develop all apps and packages, run the following command
    ```bash
        npm run dev (for backend)
        npm start (for frontend)
    ```