// import all the stuff we need
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import bookings from "./bookings.json" assert { type: "json" };
import moment from "moment";

// initialise the server
const app = express();

app.use(express.json());
app.use(cors());

const saveBookings = async () => {
  await fs.writeFile("./bookings.json", JSON.stringify(bookings, null, 2));
};
const getNextId = () => {
  return bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
};
const validateBooking = (booking) => {
  const requiredFields = ["roomId", "title", "firstName", "surname", "email", "checkInDate", "checkOutDate"];
  return requiredFields.every(field => booking[field] && booking[field].toString().trim() !== "");
};
// Add other routes and logic as needed

// GET /bookings
app.get("/bookings", (request, response) => {
  response.json(bookings);
});


// GET /bookings/search
app.get("/bookings/search", (request, response) => {
  const { date } = request.query;
  if (!date) {
    return response.status(400).json({ error: "Date query parameter is required" });
  }
  const searchDate = moment(date, "YYYY-MM-DD");
  if (!searchDate.isValid()) {
    return response.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
  }
  const results = bookings.filter(booking => {
    const checkInDate = moment(booking.checkInDate, "YYYY-MM-DD");
    const checkOutDate = moment(booking.checkOutDate, "YYYY-MM-DD");
    return searchDate.isBetween(checkInDate, checkOutDate, null, '[]');
  });
  response.json(results);
});

//To read one specific booking  by Id
app.get("/bookings/:id", (request, response) => {
  const id = Number(request.params.id);
  const chosenBooking = bookings.find((booking) => booking.id === id);
  if (chosenBooking) {
    response.send(chosenBooking);
  } else {
    response.status(404).send({ error: "Booking not found" });
  }
});

// POST /bookings







app.post("/bookings", async (request, response) => {
  const { roomId, title, firstName, surname, email, checkInDate, checkOutDate } = request.body;
 

  
  const newBooking = {
    id: getNextId(),
    roomId,
    title,
    firstName,
    surname,
    email,
    checkInDate,
    checkOutDate
  };


  if (!validateBooking(newBooking)) {
    return response.status(400).json({ error: "All fields are required and must not be empty" });
  }
  bookings.push(newBooking);
  try {
    await saveBookings();
    response.status(201).json(newBooking);
  } catch (error) {
    response.status(500).json({ error: "Failed to save booking" });
  }
});


// DELETE /bookings/:id
app.delete("/bookings/:id", async (request, response) => {
  const id = Number(request.params.id);
  const index = bookings.findIndex(booking => booking.id === id);
  if (index === -1) {
    return response.status(404).json({ error: "Booking not found" });
  }
  const [deletedBooking] = bookings.splice(index, 1);
  try {
    await saveBookings();
    response.json(deletedBooking);
  } catch (error) {
    response.status(500).json({ error: "Failed to delete booking" });
  }
});







const listener = app.listen(process.env.PORT || 3006, () => {
  console.log("Your app is listening on port " + listener.address().port);
});




// Render simple views for testing and exploring
// You can safely delete everything below if you wish

// Set EJS as the templating engine for the app
app.set("view engine", "ejs");
// Calculate __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set("views", path.join(__dirname, "views"));
// HERE WE MAKE ROUTES SAME AS ANY ENDPOINT, BUT USE RENDER INSTEAD OF SIMPLY RETURNING DATA
app.get("/", (request, response) => {
  // Use render to load up an ejs view file
  response.render("index", { title: "Hotel Booking Server" });
});
app.get("/guests", (request, response) => {
  response.render("guests", { bookings });
});
