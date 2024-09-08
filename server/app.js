import express from "express";
import {
  getTodo,
  shareTodo,
  deleteTodo,
  getTodosByID,
  createTodo,
  toggleCompleted,
  getUserByEmail,
  getUserByID,
  getSharedTodoByID,
} from "./database.js";
//import bodyParser from "body-parser";
import cors from "cors";

const corsOption = {
  origin: "*", // specify the allowed origin
  methods: ["POST", "GET"], // specify the allowed methos
  credentials: true, // allow sending credentials (cookies, authentication)
};

const app = express();
app.use(express.json());
app.use(cors(corsOption));

app.get("/todos/:id", async (req, res) => {
  const todos = await getTodosByID(req.params.id);
  res.status(200).send(todos);
});

app.get("/todos/shared_todos/:id", async (req, res) => {
  const todo = await getSharedTodoByID(req.params.id);
  const author = await getUserByID(todo.user_id);
  const shared_with = await getUserByID(todo.shared_with_id);
  res.status(200).send({ author, shared_with });
});

app.get("/users/:id", async (req, res) => {
  const user = await getUserByID(req.params.id);
  res.status(200).send(user);
});

app.put("/todos/:id", async (req, res) => {
  const { value } = req.body;
  const todo = await toggleCompleted(req.params.id, value);
  res.status(200).send(todo);
});

app.delete("/todos/:id", async (req, res) => {
  await deleteTodo(req.params.id);
  res.send({ message: "Todo deleted successfully" });
});

/* app.post("/todos/shared_todos", async (req, res) => {
  const { todo_id, user_id, email } = req.body;
  // const { todo_id, user_id, shared_with_id } = req.body;
  const userToShare = await getUserByEmail(email);
  const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
  res.status(201).send(sharedTodo);
}); */

app.post("/todos/shared_todos", async (req, res) => {
  try {
    const { todo_id, user_id, email } = req.body;
    const userToShare = await getUserByEmail(email);

    if (!userToShare) {
      return res.status(404).send({ error: "User not found" });
    }

    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    console.log(sharedTodo);

    if (!sharedTodo) {
      return res.status(400).send({ error: "Failed to share todo" });
    }

    res.status(201).send({ sharedTodo });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.post("/todos", async (req, res) => {
  const { user_id, title } = req.body;
  const todo = await createTodo(user_id, title);
  res.status(201).send(todo);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
