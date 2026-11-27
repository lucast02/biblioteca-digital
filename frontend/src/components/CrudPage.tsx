import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { ZodType } from "zod";
import { apiService } from "../services/api";
import type { Resource } from "../types";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "select" | "textarea";
  optionsKey?: Resource;
  optional?: boolean;
};
type ColumnConfig = { label: string; key: string };
type PageConfig = {
  title: string;
  singular: string;
  resource: Resource;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  schema: ZodType<any>;
};
type Props = { config: PageConfig };

function readPath(value: any, path: string): string {
  const result = path.split(".").reduce((current, key) => current?.[key], value);
  if (result === null || result === undefined || result === "") return "—";
  if (path.toLowerCase().includes("date")) {
    const date = new Date(String(result));
    return Number.isNaN(date.getTime()) ? String(result) : date.toLocaleDateString("pt-BR");
  }
  return String(result);
}

function emptyForm(config: PageConfig): Record<string, string> {
  const values: Record<string, string> = {};
  config.fields.forEach((field) => {
    values[field.name] = field.type === "date" && field.name !== "returnDate" ? new Date().toISOString().slice(0, 10) : "";
  });
  return values;
}

export function CrudPage({ config }: Props) {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [options, setOptions] = useState<Record<string, Record<string, any>[]>>({});
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [form, setForm] = useState<Record<string, string>>(() => emptyForm(config));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const data = await apiService.list(config.resource);
      setRows(data);
      const optionKeys = [...new Set(config.fields.map((field) => field.optionsKey).filter(Boolean))] as Resource[];
      const loaded: Record<string, Record<string, any>[]> = {};
      for (const key of optionKeys) loaded[key] = await apiService.list(key);
      setOptions(loaded);
      setMessage("");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Não foi possível carregar os dados. Verifique se a API está ativa.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadData(); }, [config.resource]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    if (!term) return rows;
    return rows.filter((row) => config.columns.some((column) => readPath(row, column.key).toLocaleLowerCase("pt-BR").includes(term)));
  }, [rows, search, config.columns]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm(config));
    setFieldErrors({});
    setMessage("");
    setModalOpen(true);
  }

  function openEdit(row: Record<string, any>) {
    const next: Record<string, string> = {};
    config.fields.forEach((field) => {
      const value = row[field.name];
      next[field.name] = value == null ? "" : field.type === "date" ? String(value).slice(0, 10) : String(value);
    });
    setEditing(row);
    setForm(next);
    setFieldErrors({});
    setMessage("");
    setModalOpen(true);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setMessage("");
    const payload: Record<string, unknown> = { ...form };
    config.fields.forEach((field) => {
      if (field.type === "number" || field.type === "select") payload[field.name] = Number(form[field.name]);
      if (field.optional && !form[field.name]) payload[field.name] = null;
    });
    const parsed = config.schema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { nextErrors[String(issue.path[0])] = issue.message; });
      setFieldErrors(nextErrors);
      return;
    }

    setSaving(true);
    try {
      if (editing) await apiService.update(config.resource, editing.id, parsed.data as Record<string, unknown>);
      else await apiService.create(config.resource, parsed.data as Record<string, unknown>);
      setModalOpen(false);
      await loadData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Não foi possível salvar o registro.");
      setFieldErrors(error.response?.data?.errors || {});
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: Record<string, any>) {
    if (!window.confirm(`Deseja realmente remover este ${config.singular.toLowerCase()}?`)) return;
    try {
      await apiService.remove(config.resource, row.id);
      await loadData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Não foi possível remover o registro.");
    }
  }

  return (
    <section className="page-content">
      <div className="page-heading">
        <div><p className="eyebrow">GERENCIAMENTO</p><h1>{config.title}</h1><p className="muted">Consulte e mantenha os registros da biblioteca.</p></div>
        <button className="primary-button" onClick={openCreate}>＋ Novo {config.singular}</button>
      </div>
      <div className="toolbar">
        <div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Buscar ${config.title.toLowerCase()}...`} /></div>
        <span className="result-count">{filteredRows.length} registro(s)</span>
      </div>
      {message && <div className="alert error-alert">{message}</div>}
      <div className="table-card">
        {loading ? <div className="empty-state">Carregando registros...</div> : filteredRows.length === 0 ? <div className="empty-state">Nenhum registro encontrado.</div> : (
          <div className="table-scroll"><table><thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th className="actions-heading">Ações</th></tr></thead><tbody>
            {filteredRows.map((row) => <tr key={row.id}>{config.columns.map((column) => <td key={column.key}>{readPath(row, column.key)}</td>)}<td className="row-actions"><button className="text-button" onClick={() => openEdit(row)}>Editar</button><button className="text-button danger-text" onClick={() => void handleDelete(row)}>Excluir</button></td></tr>)}
          </tbody></table></div>
        )}
      </div>
      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
        <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div><p className="eyebrow">{editing ? "ATUALIZAÇÃO" : "NOVO CADASTRO"}</p><h2 id="modal-title">{editing ? `Editar ${config.singular}` : `Cadastrar ${config.singular}`}</h2></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Fechar">×</button></div>
          <form onSubmit={handleSave} noValidate>
            <div className="form-grid">{config.fields.map((field) => <label className={field.type === "textarea" ? "wide-field" : ""} key={field.name}>{field.label}
              {field.type === "select" ? <select value={form[field.name] ?? ""} onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))}><option value="">Selecione...</option>{(options[field.optionsKey || "autores"] || []).map((option) => <option key={option.id} value={option.id}>{option.name || option.title}</option>)}</select>
                : field.type === "textarea" ? <textarea rows={3} value={form[field.name] ?? ""} onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))} />
                : <input type={field.type || "text"} value={form[field.name] ?? ""} onChange={(e) => setForm((current) => ({ ...current, [field.name]: e.target.value }))} />}
              {fieldErrors[field.name] && <small className="field-error">{fieldErrors[field.name]}</small>}
            </label>)}</div>
            {message && <div className="alert error-alert">{message}</div>}
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</button></div>
          </form>
        </section>
      </div>}
    </section>
  );
}
