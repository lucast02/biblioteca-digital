import { useState } from "react";
import { AuthScreen } from "./components/AuthScreen";
import { CrudPage } from "./components/CrudPage";
import { pageConfigs } from "./config/pages";
import type { Resource } from "./types";

type User = { id: number; name: string; email: string };

const navigation: { key: Resource; label: string; icon: string }[] = [
  { key: "autores", label: "Autores", icon: "✎" },
  { key: "livros", label: "Livros", icon: "▤" },
  { key: "leitores", label: "Leitores", icon: "♙" },
  { key: "emprestimos", label: "Empréstimos", icon: "⇄" },
];

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(localStorage.getItem("biblioteca-token")));
  const [activePage, setActivePage] = useState<Resource>("livros");
  const [user, setUser] = useState<User | null>(null);

  function handleAuthenticated(data: { token: string; user: User }) {
    localStorage.setItem("biblioteca-token", data.token);
    setUser(data.user);
    setAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("biblioteca-token");
    setAuthenticated(false);
    setUser(null);
  }

  if (!authenticated) return <AuthScreen onAuthenticated={handleAuthenticated} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand"><div className="brand-mark small-mark">B<span>+</span></div><div><strong>Biblioteca</strong><small>PAINEL DE CONTROLE</small></div></div>
        <div className="side-label">MENU PRINCIPAL</div>
        <nav>{navigation.map((item) => <button key={item.key} className={activePage === item.key ? "nav-item active" : "nav-item"} onClick={() => setActivePage(item.key)}><span className="nav-icon">{item.icon}</span>{item.label}</button>)}</nav>
        <div className="sidebar-bottom"><div className="profile-avatar">{(user?.name || "B").slice(0, 1).toUpperCase()}</div><div className="profile-data"><strong>{user?.name || "Usuário"}</strong><small>{user?.email || "Sessão ativa"}</small></div><button className="logout-button" onClick={logout} title="Sair">↪</button></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><span>Biblioteca <span className="breadcrumb-separator">/</span> {pageConfigs[activePage].title}</span><span className="status-pill"><i /> Sistema online</span></header>
        <CrudPage key={activePage} config={pageConfigs[activePage]} />
        <footer className="app-footer">Biblioteca Digital <span>·</span> Projeto acadêmico de Desenvolvimento Web</footer>
      </main>
    </div>
  );
}
