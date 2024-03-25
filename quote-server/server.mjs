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

// Function to pick one element at random from an array
const pickFromArray = (array) =>
  array[Math.floor(Math.random() * array.length)];

// Start the server
const listener = app.listen(3002, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
