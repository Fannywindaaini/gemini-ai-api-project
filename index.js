const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import the Google Generative AI library
const express = require('express');  // Import Express for creating the API server
const cors = require('cors');
const dotenv = require('dotenv'); // Load environment variables from a .env file

dotenv.config(); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.PORT || 3000; // Set the port from environment variables or default to 3000

app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY); // Initialize the Google Generative AI client with the API key
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Get the Gemini 2.5 Flash model

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if(!userMessage) {
        return res.status(400).json({reply: "Message is required."});
    }

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text(); // Extract the text from the response
        
        res.status(200).json({ reply: text }); // Send the generated text as a response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong.'});
    }
});

app.listen(port, () => {
    console.log(`Gemini Chatbot running on http://localhost:${port}`);
}); // Start the server and listen on the specified port


