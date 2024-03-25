import express from "express";
import quotes from "./quotes.json" assert { type: "json" };

const app = express();

app.get("/", (request, response) => {
  response.send("Neill's Quote Server! Ask me for /quotes/random, or /quotes");
});

// Route to return all quotes
app.get("/quotes", (req, res) => {
  res.json(quotes);
});

// Route to return one random quote
app.get("/quotes/random", (req, res) => {
  const randomQuote = pickFromArray(quotes);
  res.json(randomQuote);
});

// Route to search for a quote
app.get("/quotes/search", (req, res) => {
  const searchTerm = req.query.term.toLowerCase();
  const searchResults = quotes.filter(
    (quote) =>
      quote.quote.toLowerCase().includes(searchTerm) ||
      quote.author.toLowerCase().includes(searchTerm)
  );
  res.json(searchResults);
});

// Function to pick one element at random from an array
const pickFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Start the server
const listener = app.listen(3002, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
