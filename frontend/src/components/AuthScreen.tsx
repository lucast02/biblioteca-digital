
import { useState, type FormEvent } from "react";
import { cadastroSchema, loginSchema } from "../../../shared/src/index.ts";
import { apiService } from "../services/api";

type Props = { onAuthenticated: (data: { token: string; user: { id: number; name: string; email: string } }) => void };

type FieldErrors = Record<string, string>;

export function AuthScreen({ onAuthenticated }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setErrors({});

    const schema = mode === "login" ? loginSchema : cadastroSchema;
    const values = mode === "login" ? { email, password } : { name, email, password };
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      const result = mode === "login"
        ? await apiService.login(parsed.data as { email: string; password: string })
        : await apiService.register(parsed.data as { name: string; email: string; password: string });

      onAuthenticated(result);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Não foi possível acessar o sistema. Confira a API e tente novamente.");
      setErrors(error.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setErrors({});
    setMessage("");
  }

  return (
    <main className="auth-shell">
      <section className="auth-aside">
        <div className="brand-mark">B<span>+</span></div>
        <p className="eyebrow">BIBLIOTECA DIGITAL</p>
        <h1>Histórias que merecem um lugar.</h1>
        <p className="aside-copy">
          Organize o acervo, acompanhe leitores e mantenha os empréstimos em dia.
        </p>
        <div className="book-decoration">
          <span>01</span>
          <span>02</span>
          <span>03</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">ÁREA RESTRITA</p>
          <h2>{mode === "login" ? "Bem-vindo de volta" : "Criar uma conta"}</h2>

          <p className="muted">
            {mode === "login"
              ? "Entre para acessar o painel da biblioteca."
              : "Preencha os dados para começar."}
          </p>

          <div className="auth-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              onClick={() => switchMode("login")}
              type="button"
            >
              Entrar
            </button>

            <button
              className={mode === "register" ? "active" : ""}
              onClick={() => switchMode("register")}
              type="button"
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {mode === "register" && (
              <label>
                Nome completo
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
                {errors.name && <small className="field-error">{errors.name}</small>}
              </label>
            )}

            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
              />
              {errors.email && <small className="field-error">{errors.email}</small>}
            </label>

            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
              />
              {errors.password && <small className="field-error">{errors.password}</small>}
            </label>

            {message && <div className="alert error-alert">{message}</div>}

            <button
              className="primary-button full-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Aguarde..."
                : mode === "login"
                  ? "Entrar no sistema"
                  : "Criar conta"}
            </button>
          </form>

          <p className="auth-foot">
            Projeto acadêmico · Sistema de gerenciamento de biblioteca
          </p>
        </div>
      </section>
    </main>
  );
}
