import React, { useState } from "react";
import "./App.css";


// Esta función crea un componente con un título y texto.
function makePage(title) {
  return function Page() {
    return (
      <div>
        <h2>{title}</h2>
        <p>Aquí va el contenido de: {title}</p>
      </div>
    );
  };
}

// ---- Nodo del árbol N-ario ----
class MenuNode {
  constructor(title, link, component) {
    this.title = title;
    this.link = link;
    this.component = component;
    this.children = []; // puede tener 0, 1, 2, 3... hijos
  }
  addChild(node) {
    this.children.push(node);
    return node;
  }
}

// ---- Árbol N-ario ----
class NaryTree {
  constructor() {
    // La raíz no se muestra: solo agrupa los menús principales
    this.root = new MenuNode("Menú", "/", makePage("Inicio"));
  }
  // Busca un nodo por su link (recorre el árbol completo)
  findByLink(link, node = this.root) {
    if (node.link === link) return node;
    for (const child of node.children) {
      const found = this.findByLink(link, child);
      if (found) return found;
    }
    return null;
  }
}

// ---- Datos simulados: menús y submenús ----
function buildMenuTree() {
  const tree = new NaryTree();
  const root = tree.root;

  root.addChild(new MenuNode("Perfil", "/perfil", makePage("Perfil")));
  root.addChild(new MenuNode("Mensajes", "/mensajes", makePage("Mensajes")));

  const settings = root.addChild(
    new MenuNode("Configuración", "/configuracion", makePage("Configuración"))
  );
  settings.addChild(
    new MenuNode("Cuenta", "/configuracion/cuenta", makePage("Cuenta"))
  );
  settings.addChild(
    new MenuNode("Perfil", "/configuracion/perfil", makePage("Perfil (configuración)"))
  );
  settings.addChild(
    new MenuNode(
      "Seguridad y privacidad",
      "/configuracion/seguridad",
      makePage("Seguridad y privacidad")
    )
  );
  settings.addChild(
    new MenuNode("Contraseña", "/configuracion/contrasena", makePage("Contraseña"))
  );
  settings.addChild(
    new MenuNode(
      "Notificaciones",
      "/configuracion/notificaciones",
      makePage("Notificaciones")
    )
  );

  const help = root.addChild(
    new MenuNode("Ayuda", "/ayuda", makePage("Ayuda"))
  );
  help.addChild(
    new MenuNode("Preguntas frecuentes", "/ayuda/preguntas", makePage("Preguntas frecuentes"))
  );
  help.addChild(
    new MenuNode("Enviar un ticket", "/ayuda/ticket", makePage("Enviar un ticket"))
  );
  help.addChild(
    new MenuNode("Estado de la red", "/ayuda/red", makePage("Estado de la red"))
  );

  root.addChild(new MenuNode("Cerrar sesión", "/salir", makePage("Sesión cerrada")));

  return tree;
}

const menuTree = buildMenuTree();

// ---- Ítem del menú (se llama a sí mismo para pintar los hijos) ----
function MenuItem({ node, current, onSelect }) {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0;

  const handleClick = () => {
    onSelect(node.link);
    if (hasChildren) setOpen(!open);
  };

  return (
    <li>
      <button
        className={current === node.link ? "active" : ""}
        onClick={handleClick}
      >
        {node.title}
        {hasChildren ? (open ? " ▲" : " ▼") : ""}
      </button>
      {hasChildren && open && (
        <ul className="submenu">
          {node.children.map((child) => (
            <MenuItem
              key={child.link}
              node={child}
              current={current}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ---- App ----
export default function App() {
  const [current, setCurrent] = useState("/perfil");

  // Busca en el árbol el nodo del link actual y usa su componente
  const node = menuTree.findByLink(current);
  const Page = node.component;

  return (
    <div className="layout">
      <nav className="sidebar">
        <ul>
          {menuTree.root.children.map((item) => (
            <MenuItem
              key={item.link}
              node={item}
              current={current}
              onSelect={setCurrent}
            />
          ))}
        </ul>
      </nav>
      <main className="content">
        <p>Link actual: {node.link}</p>
        <Page />
      </main>
    </div>
  );
}
