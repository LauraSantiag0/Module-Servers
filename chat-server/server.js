process.env.PORT = process.env.PORT || 9090;
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

// Obtendo __dirname em um módulo ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const welcomeMessage = {
  id: 0,
  from: "Maria",
  text: "Bem-vindo ao sistema de chat!",
};

// Este array é nosso "data store".
// Começaremos com uma mensagem no array.
let messages = [welcomeMessage];
let count = 0;

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res) => {
  res.send(messages);
});

app.get("/messages/search", (req, res) => {
  const searchTerm = req.query.text.toLowerCase();
  const filteredMessages = messages.filter((message) =>
    message.text.toLowerCase().includes(searchTerm)
  );
  res.send(filteredMessages);
});

app.get("/messages/latest", (req, res) => {
  const lastTenMessages = messages.slice(messages.length - 10);
  res.send(lastTenMessages);
});

app.get("/messages/:id", (req, res) => {
  const messageId = Number(req.params.id);
  const foundMessage = messages.find((message) => message.id === messageId);
  res.send(foundMessage);
});

app.put("/messages/:id", (req, res) => {
  const findIndex = messages.findIndex(
    (message) => message.id === Number(req.params.id)
  );
  const updatedMessage = { ...messages[findIndex], ...req.body };
  messages.splice(findIndex, 1, updatedMessage);
  res.status(200).send({ success: true });
});

app.use(express.urlencoded({ extended: true }));
app.post("/messages", (req, res) => {
  const newMessage = req.body;
  if (newMessage.from === "" || newMessage.text === "") {
    res.status(400);
  } else {
    count++;
    const id = { id: count };
    const currentTime = new Date().toLocaleTimeString();
    const timeSent = { timeSent: currentTime };
    messages.push(Object.assign(id, newMessage, timeSent));
    res.send("Sua mensagem foi adicionada com sucesso!");
  }
});

app.delete("/messages/:messageId", (req, res) => {
  const messageId = Number(req.params.messageId);
  messages = messages.filter((message) => message.id !== messageId);
  res.status(204).send();
});


app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}...`);
});
