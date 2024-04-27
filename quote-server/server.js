
import express from 'express';
import quotes from './quotes.json' assert { type: "json" }; // Assuming quotes.json is in the same directory

const app = express();
const PORT = 3000;

// Route to return all quotes
app.get('/quotes', (req, res) => {
  res.json(quotes);
});

// Route to return a random quote
app.get('/quotes/random', (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(randomQuote);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

