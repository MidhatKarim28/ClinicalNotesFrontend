# AI Clinical Notes Generator - Frontend

This is the frontend application for the AI Clinical Notes Generator.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Running the Application

1. Clone this repository:
   ```
   git clone https://github.com/MidhatKarim28/ai-clinical-notes-frontend.git
   ```

2. Navigate to the project directory:
   ```
   cd ai-clinical-notes-frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a .env file in the root directory and add the API URL:
   ```
   echo "VUE_APP_API_URL=http://localhost:5000/api" > .env
   ```

5. Run the development server:
   ```
   npm run serve
   ```

6. The application will be available at http://localhost:8080.

## Building for Production

To build the application for production, run:
```
npm run build
```

This will create a `dist` folder with the compiled assets, which can be served by any static file server.

## Features

- Real-time transcription simulation
- Generation of clinical notes using AI
- User-friendly interface for entering patient context and viewing transcriptions and notes

