import React, { useState } from "react";

/* =========================================================
   DESAFÍO 04 - versión básica, sin estilos
   Una pila (stack) funciona como una torre de libros: LIFO
   (Last In, First Out = el último en entrar es el primero en salir)
   1) Pila de libros con nombre, ISBN, autor y editorial
   2) Pila llenada con datos simulados
   3) Pantalla con formulario para agregar un libro (push)
   4) Pantalla que imprime la pila (el de arriba va primero)
   ========================================================= */

// ---- Pila ----
class Stack {
  constructor() {
    this.items = [];
  }
  // Pone un libro arriba de la pila
  push(book) {
    this.items.push(book);
  }
  // Quita y devuelve el libro de arriba (null si la pila está vacía)
  pop() {
    if (this.items.length === 0) return null;
    return this.items.pop();
  }
  // Mira el libro de arriba sin quitarlo
  peek() {
    if (this.items.length === 0) return null;
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
  // Devuelve los libros de arriba hacia abajo
  toArray() {
    return [...this.items].reverse();
  }
}

// ---- Datos simulados ----
// Se agregan en este orden, así que "Las almas de Brandon" queda arriba.
function buildStack() {
  const stack = new Stack();
  const books = [
    {
      name: "Cómo hacer que te pasen cosas buenas",
      isbn: "9788467053302",
      author: "Marian Rojas Estapé",
      editorial: "Espasa",
    },
    {
      name: "Encuentra tu persona vitamina",
      isbn: "9788467062212",
      author: "Marian Rojas Estapé",
      editorial: "Espasa",
    },
    {
      name: "Recupera tu mente, reconquista tu vida",
      isbn: "9788467071320",
      author: "Marian Rojas Estapé",
      editorial: "Espasa",
    },
    {
      name: "Las 21 leyes irrefutables del liderazgo",
      isbn: "9781602553507",
      author: "John C. Maxwell",
      editorial: "Grupo Nelson",
    },
    {
      name: "El arte de cerrar la venta",
      isbn: "9781602550094",
      author: "Brian Tracy",
      editorial: "Grupo Nelson",
    },
    {
      name: "Las almas de Brandon",
      isbn: "9788467052442",
      author: "César Brandon Ndjocu",
      editorial: "Espasa",
    },
  ];
  books.forEach((b) => stack.push(b));
  return stack;
}

// ---- Pantalla 1: Formulario para agregar un libro ----
function FormPage({ onAdd }) {
  const [name, setName] = useState("");
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [editorial, setEditorial] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !isbn.trim() || !author.trim() || !editorial.trim()) {
      setMessage("Completa todos los campos.");
      return;
    }
    onAdd({
      name: name.trim(),
      isbn: isbn.trim(),
      author: author.trim(),
      editorial: editorial.trim(),
    });
    setName("");
    setIsbn("");
    setAuthor("");
    setEditorial("");
    setMessage("Libro agregado a la pila.");
  };

  return (
    <div>
      <h2>Agregar libro</h2>
      <form onSubmit={handleSubmit}>
        <p>
          Nombre: <input value={name} onChange={(e) => setName(e.target.value)} />
        </p>
        <p>
          ISBN: <input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        </p>
        <p>
          Autor:{" "}
          <input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </p>
        <p>
          Editorial:{" "}
          <input
            value={editorial}
            onChange={(e) => setEditorial(e.target.value)}
          />
        </p>
        <button type="submit">Agregar a la pila</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

// ---- Pantalla 2: Imprimir la pila ----
function StackPage({ books, onPop }) {
  return (
    <div>
      <h2>Pila de libros</h2>
      <p>Libros en la pila: {books.length}</p>
      <button onClick={onPop} disabled={books.length === 0}>
        Quitar libro de arriba
      </button>
      {books.length === 0 ? (
        <p>La pila está vacía.</p>
      ) : (
        <ol>
          {books.map((b, i) => (
            <li key={b.isbn + i}>
              {i === 0 ? <b>{b.name} (arriba)</b> : b.name}
              <br />
              ISBN: {b.isbn} | Autor: {b.author} | Editorial: {b.editorial}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ---- App: navegación entre las 2 pantallas ----
export default function App() {
  const [stack] = useState(() => buildStack());
  const [books, setBooks] = useState(() => stack.toArray());
  const [route, setRoute] = useState("stack");

  const addBook = (book) => {
    stack.push(book);
    setBooks(stack.toArray());
  };

  const removeTop = () => {
    stack.pop();
    setBooks(stack.toArray());
  };

  return (
    <div>
      <h1>Desafío pila de libros</h1>
      <button onClick={() => setRoute("form")}>Agregar libro</button>{" "}
      <button onClick={() => setRoute("stack")}>Ver pila</button>
      <hr />
      {route === "form" ? (
        <FormPage onAdd={addBook} />
      ) : (
        <StackPage books={books} onPop={removeTop} />
      )}
    </div>
  );
}
