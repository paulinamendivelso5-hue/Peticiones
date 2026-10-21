const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// 5 materias del colegio
let tasks = [
  {
    id: 1,
    titulo: "Matematicas",
    descripcion: "Resolver ejercicios matematicos",
    estado: "pendiente",
    pasos: ["Estudiar", "Resolver ejercicios"]
  },
  {
    id: 2,
    titulo: "Espanol",
    descripcion: "Realizar actividades de lectura y escritura",
    estado: "completada",
    pasos: ["Leer", "Responder preguntas"]
  },
  {
    id: 3,
    titulo: "Biologia",
    descripcion: "Estudiar los seres vivos",
    estado: "pendiente",
    pasos: ["Leer apuntes", "Hacer resumen"]
  },
  {
    id: 4,
    titulo: "Ingles",
    descripcion: "Practicar vocabulario y gramatica",
    estado: "pendiente",
    pasos: ["Estudiar palabras", "Practicar"]
  },
  {
    id: 5,
    titulo: "Informatica",
    descripcion: "Aprender programacion y tecnologia",
    estado: "completada",
    pasos: ["Leer la guia", "Practicar codigo"]
  }
];

// 1. Obtener todas las materias
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// 2. Buscar una materia por nombre
app.get("/tasks/title/:titulo", (req, res) => {
  const titulo = req.params.titulo;

  const task = tasks.find(
    task => task.titulo.toLowerCase() === titulo.toLowerCase()
  );

  if (!task) {
    return res.status(404).json({
      message: "Materia no encontrada."
    });
  }

  res.status(200).json(task);
});

// 3. Obtener materias pendientes
app.get("/tasks/pending", (req, res) => {
  res.status(200).json(
    tasks.filter(task => task.estado === "pendiente")
  );
});

// 4. Obtener materias completadas
app.get("/tasks/completed", (req, res) => {
  res.status(200).json(
    tasks.filter(task => task.estado === "completada")
  );
});

// 5. Agregar una materia
app.post("/tasks", (req, res) => {
  const { titulo, descripcion, estado, pasos } = req.body;

  if (
    typeof titulo !== "string" || !titulo.trim() ||
    typeof descripcion !== "string" || !descripcion.trim() ||
    !["pendiente", "completada"].includes(estado) ||
    !Array.isArray(pasos) ||
    !pasos.every(paso => typeof paso === "string")
  ) {
    return res.status(400).json({
      message: "Los datos de la materia no son validos."
    });
  }

  const newId = tasks.length > 0
    ? Math.max(...tasks.map(task => task.id)) + 1
    : 1;

  const newTask = {
    id: newId,
    titulo: titulo.trim(),
    descripcion: descripcion.trim(),
    estado: estado,
    pasos: pasos
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Materia agregada correctamente.",
    task: newTask
  });
});

// 6. Actualizar una materia
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { titulo, descripcion, estado, pasos } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Materia no encontrada." });
  }

  if (
    typeof titulo !== "string" || !titulo.trim() ||
    typeof descripcion !== "string" || !descripcion.trim() ||
    !["pendiente", "completada"].includes(estado) ||
    !Array.isArray(pasos) ||
    !pasos.every(paso => typeof paso === "string")
  ) {
    return res.status(400).json({ message: "Datos invalidos." });
  }

  task.titulo = titulo.trim();
  task.descripcion = descripcion.trim();
  task.estado = estado;
  task.pasos = pasos;

  res.status(200).json({
    message: "Materia actualizada correctamente.",
    task: task
  });
});

// 7. Actualizar el estado de una materia
app.patch("/tasks/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const { estado } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  if (!["pendiente", "completada"].includes(estado)) {
    return res.status(400).json({ message: "Estado invalido." });
  }

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Materia no encontrada." });
  }

  task.estado = estado;

  res.status(200).json({
    message: "Estado actualizado correctamente.",
    task: task
  });
});

// 8. Eliminar una materia
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const task = tasks.find(task => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Materia no encontrada." });
  }

  tasks = tasks.filter(task => task.id !== id);

  res.status(200).json({
    message: "Materia eliminada correctamente."
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});