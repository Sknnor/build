import { useState, useRef, useEffect } from 'react';

const COLUMNS = [
  { id: 'backlog', label: 'Backlog', icon: '◈', color: '#4a5568' },
  { id: 'sprint', label: 'Sprint', icon: '⚡', color: '#6c63ff' },
  { id: 'doing', label: 'En Progreso', icon: '◉', color: '#f6ad55' },
  { id: 'review', label: 'En Revisión', icon: '◎', color: '#4fd1c5' },
  { id: 'done', label: 'Hecho', icon: '◆', color: '#68d391' },
];

const TAGS = [
  { id: 'eda', label: 'EDA', color: '#9b59b6' },
  { id: 'model', label: 'Modelado', color: '#e74c3c' },
  { id: 'etl', label: 'ETL', color: '#e67e22' },
  { id: 'viz', label: 'Visualización', color: '#3498db' },
  { id: 'report', label: 'Reporte', color: '#27ae60' },
  { id: 'clean', label: 'Limpieza', color: '#f39c12' },
  { id: 'ml', label: 'ML', color: '#c0392b' },
  { id: 'sql', label: 'SQL', color: '#1abc9c' },
  { id: 'doc', label: 'Documentación', color: '#7f8c8d' },
  { id: 'meeting', label: 'Reunión', color: '#2c3e50' },
];

const PRIORITIES = [
  { id: 'critical', label: 'Crítica', color: '#e53e3e', dot: '●' },
  { id: 'high', label: 'Alta', color: '#dd6b20', dot: '●' },
  { id: 'medium', label: 'Media', color: '#d69e2e', dot: '●' },
  { id: 'low', label: 'Baja', color: '#38a169', dot: '●' },
];

const SPRINT_OPTIONS = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'];

const INITIAL_TASKS = [
  {
    id: 't1',
    title: 'Análisis exploratorio dataset ventas',
    description:
      'EDA completo del dataset de ventas Q4 con distribuciones y outliers',
    column: 'sprint',
    tags: ['eda', 'clean'],
    priority: 'high',
    sprint: 'Sprint 1',
    points: 5,
    assignee: 'Tú',
  },
  {
    id: 't2',
    title: 'Pipeline ETL fuentes externas',
    description: 'Construir pipeline para ingestar datos desde API REST de CRM',
    column: 'backlog',
    tags: ['etl', 'sql'],
    priority: 'medium',
    sprint: 'Sprint 2',
    points: 8,
    assignee: 'Tú',
  },
  {
    id: 't3',
    title: 'Dashboard KPIs comerciales',
    description:
      'Crear tablero en Power BI con métricas de conversión y retención',
    column: 'doing',
    tags: ['viz', 'report'],
    priority: 'high',
    sprint: 'Sprint 1',
    points: 5,
    assignee: 'Tú',
  },
  {
    id: 't4',
    title: 'Modelo predicción churn',
    description:
      'Entrenar modelo XGBoost para predicción de abandono de clientes',
    column: 'backlog',
    tags: ['ml', 'model'],
    priority: 'medium',
    sprint: 'Sprint 3',
    points: 13,
    assignee: 'Tú',
  },
  {
    id: 't5',
    title: 'Documentar proceso limpieza datos',
    description: 'Registrar reglas de negocio y decisiones en Confluence',
    column: 'done',
    tags: ['doc', 'clean'],
    priority: 'low',
    sprint: 'Sprint 1',
    points: 2,
    assignee: 'Tú',
  },
  {
    id: 't6',
    title: 'Sprint Review presentación',
    description: 'Preparar demo de resultados del sprint para stakeholders',
    column: 'review',
    tags: ['meeting', 'report'],
    priority: 'critical',
    sprint: 'Sprint 1',
    points: 3,
    assignee: 'Tú',
  },
];

function generateId() {
  return 't' + Math.random().toString(36).substr(2, 9);
}

function TagBadge({ tagId }) {
  const tag = TAGS.find((t) => t.id === tagId);
  if (!tag) return null;
  return (
    <span
      style={{
        background: tag.color + '22',
        color: tag.color,
        border: `1px solid ${tag.color}44`,
        borderRadius: '4px',
        padding: '1px 6px',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '0.04em',
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {tag.label}
    </span>
  );
}

function PriorityDot({ priorityId }) {
  const p = PRIORITIES.find((p) => p.id === priorityId);
  if (!p) return null;
  return (
    <span
      title={p.label}
      style={{ color: p.color, fontSize: '10px', marginRight: '4px' }}
    >
      {p.dot}
    </span>
  );
}

function StoryPoints({ points }) {
  return (
    <span
      style={{
        background: '#6c63ff22',
        color: '#a78bfa',
        border: '1px solid #6c63ff44',
        borderRadius: '4px',
        padding: '1px 6px',
        fontSize: '10px',
        fontWeight: '700',
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {points}pt
    </span>
  );
}

function TaskCard({ task, onDragStart, onEdit, onDelete }) {
  const col = COLUMNS.find((c) => c.id === task.column);
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      style={{
        background: '#1a1a2e',
        border: '1px solid #2d2d4e',
        borderLeft: `3px solid ${col?.color || '#6c63ff'}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'grab',
        transition: 'transform 0.15s, box-shadow 0.15s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 6px 20px rgba(108,99,255,0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '6px',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}
        >
          <PriorityDot priorityId={task.priority} />
          <span
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#e2e8f0',
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: '1.3',
            }}
          >
            {task.title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          <button
            onClick={() => onEdit(task)}
            style={{
              background: 'none',
              border: 'none',
              color: '#718096',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '0 2px',
              lineHeight: 1,
            }}
            title="Editar"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(task.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#718096',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '0 2px',
              lineHeight: 1,
            }}
            title="Eliminar"
          >
            ×
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p
          style={{
            fontSize: '11px',
            color: '#718096',
            margin: '0 0 8px 0',
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: '1.4',
          }}
        >
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            marginBottom: '8px',
          }}
        >
          {task.tags.map((t) => (
            <TagBadge key={t} tagId={t} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <StoryPoints points={task.points || 1} />
        <span
          style={{
            fontSize: '10px',
            color: '#4a5568',
            fontFamily: "'DM Mono', monospace",
            background: '#0d0d1a',
            border: '1px solid #2d2d4e',
            borderRadius: '4px',
            padding: '1px 5px',
          }}
        >
          {task.sprint}
        </span>
      </div>
    </div>
  );
}

function Modal({ task, onSave, onClose }) {
  const [form, setForm] = useState(
    task || {
      title: '',
      description: '',
      column: 'backlog',
      tags: [],
      priority: 'medium',
      sprint: 'Sprint 1',
      points: 3,
      assignee: 'Tú',
    }
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleTag = (tid) => {
    set(
      'tags',
      form.tags.includes(tid)
        ? form.tags.filter((t) => t !== tid)
        : [...form.tags, tid]
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: '#12122a',
          border: '1px solid #2d2d4e',
          borderRadius: '14px',
          padding: '28px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        <h2
          style={{
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '700',
            color: '#e2e8f0',
            fontFamily: "'DM Sans', sans-serif",
            borderBottom: '1px solid #2d2d4e',
            paddingBottom: '12px',
          }}
        >
          {task?.id ? '✎ Editar Tarea' : '+ Nueva Tarea'}
        </h2>

        <label style={labelStyle}>Título *</label>
        <input
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Ej: Limpieza dataset de usuarios..."
          style={inputStyle}
        />

        <label style={labelStyle}>Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Detalla el objetivo o criterios de aceptación..."
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <div>
            <label style={labelStyle}>Columna</label>
            <select
              value={form.column}
              onChange={(e) => set('column', e.target.value)}
              style={inputStyle}
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sprint</label>
            <select
              value={form.sprint}
              onChange={(e) => set('sprint', e.target.value)}
              style={inputStyle}
            >
              {SPRINT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Prioridad</label>
            <select
              value={form.priority}
              onChange={(e) => set('priority', e.target.value)}
              style={inputStyle}
            >
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Story Points</label>
            <select
              value={form.points}
              onChange={(e) => set('points', Number(e.target.value))}
              style={inputStyle}
            >
              {[1, 2, 3, 5, 8, 13, 21].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label style={labelStyle}>Etiquetas</label>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '20px',
          }}
        >
          {TAGS.map((tag) => {
            const active = form.tags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                style={{
                  background: active ? tag.color + '33' : '#1a1a2e',
                  color: active ? tag.color : '#718096',
                  border: `1px solid ${active ? tag.color + '88' : '#2d2d4e'}`,
                  borderRadius: '5px',
                  padding: '3px 9px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: "'DM Mono', monospace",
                  transition: 'all 0.15s',
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>

        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          <button onClick={onClose} style={btnSecondary}>
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!form.title.trim()) return;
              onSave({ ...form, id: form.id || generateId() });
            }}
            style={btnPrimary}
          >
            {task?.id ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  color: '#718096',
  marginBottom: '5px',
  marginTop: '12px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontFamily: "'DM Mono', monospace",
};

const inputStyle = {
  width: '100%',
  background: '#0d0d1a',
  border: '1px solid #2d2d4e',
  borderRadius: '6px',
  color: '#e2e8f0',
  padding: '8px 10px',
  fontSize: '13px',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box',
};

const btnPrimary = {
  background: 'linear-gradient(135deg, #6c63ff, #9b59b6)',
  border: 'none',
  borderRadius: '7px',
  color: '#fff',
  padding: '9px 20px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
};

const btnSecondary = {
  background: '#1a1a2e',
  border: '1px solid #2d2d4e',
  borderRadius: '7px',
  color: '#a0aec0',
  padding: '9px 20px',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [modal, setModal] = useState(null); // null | { mode: 'new'|'edit', task? }
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [filterSprint, setFilterSprint] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = tasks.filter((t) => {
    if (filterSprint !== 'all' && t.sprint !== filterSprint) return false;
    if (filterTag !== 'all' && !t.tags.includes(filterTag)) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const colTasks = (colId) => filtered.filter((t) => t.column === colId);

  // Stats
  const totalPoints = tasks
    .filter((t) => t.sprint === 'Sprint 1')
    .reduce((s, t) => s + (t.points || 0), 0);
  const donePoints = tasks
    .filter((t) => t.sprint === 'Sprint 1' && t.column === 'done')
    .reduce((s, t) => s + (t.points || 0), 0);
  const velocity =
    totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  const onDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const onDragOver = (e, colId) => {
    e.preventDefault();
    setDragOver(colId);
  };
  const onDrop = (e, colId) => {
    e.preventDefault();
    if (dragId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === dragId ? { ...t, column: colId } : t))
      );
    }
    setDragId(null);
    setDragOver(null);
  };

  const saveTask = (task) => {
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === task.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = task;
        return next;
      }
      return [...prev, task];
    });
    setModal(null);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#08081a',
        fontFamily: "'DM Sans', sans-serif",
        color: '#e2e8f0',
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #08081a; }
        ::-webkit-scrollbar-thumb { background: #2d2d4e; border-radius: 3px; }
        * { box-sizing: border-box; }
        select option { background: #12122a; }
      `}</style>

      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid #1a1a3a',
          background: '#0d0d22',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #6c63ff, #9b59b6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            ◈
          </div>
          <div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#e2e8f0',
                lineHeight: 1,
              }}
            >
              DataSprint Board
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#718096',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Analista de Datos — Scrum
            </div>
          </div>
        </div>

        {/* Stats chips */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total pt.', value: totalPoints, color: '#a78bfa' },
            { label: 'Completado', value: donePoints + 'pt', color: '#68d391' },
            { label: 'Velocidad', value: velocity + '%', color: '#f6ad55' },
            { label: 'Tareas', value: tasks.length, color: '#4fd1c5' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: '#1a1a2e',
                border: '1px solid #2d2d4e',
                borderRadius: '7px',
                padding: '5px 12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: s.color,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setModal({ mode: 'new' })}
          style={{
            ...btnPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          + Nueva Tarea
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: '12px 24px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderBottom: '1px solid #1a1a3a',
          background: '#0a0a1f',
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar tarea..."
          style={{
            ...inputStyle,
            width: '220px',
            background: '#12122a',
            fontSize: '12px',
          }}
        />
        <select
          value={filterSprint}
          onChange={(e) => setFilterSprint(e.target.value)}
          style={{
            ...inputStyle,
            width: '130px',
            background: '#12122a',
            fontSize: '12px',
          }}
        >
          <option value="all">Todos los Sprints</option>
          {SPRINT_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          style={{
            ...inputStyle,
            width: '140px',
            background: '#12122a',
            fontSize: '12px',
          }}
        >
          <option value="all">Todas las etiquetas</option>
          {TAGS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Priority legend */}
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
          {PRIORITIES.map((p) => (
            <span
              key={p.id}
              style={{
                fontSize: '11px',
                color: '#718096',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span style={{ color: p.color }}>●</span>
              {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          padding: '20px',
          overflowX: 'auto',
          minHeight: 'calc(100vh - 160px)',
          alignItems: 'flex-start',
        }}
      >
        {COLUMNS.map((col) => {
          const colItems = colTasks(col.id);
          const isOver = dragOver === col.id;
          const colPoints = colItems.reduce((s, t) => s + (t.points || 0), 0);

          return (
            <div
              key={col.id}
              onDragOver={(e) => onDragOver(e, col.id)}
              onDrop={(e) => onDrop(e, col.id)}
              style={{
                flex: '0 0 240px',
                background: isOver ? '#15153a' : '#0f0f28',
                border: `1px solid ${isOver ? col.color + '66' : '#1e1e3a'}`,
                borderTop: `3px solid ${col.color}`,
                borderRadius: '10px',
                padding: '12px',
                margin: '0 6px',
                transition: 'border-color 0.2s, background 0.2s',
                minHeight: '300px',
              }}
            >
              {/* Column header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span style={{ color: col.color, fontSize: '14px' }}>
                    {col.icon}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#e2e8f0',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {col.label}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
                >
                  <span
                    style={{
                      background: col.color + '22',
                      color: col.color,
                      border: `1px solid ${col.color}44`,
                      borderRadius: '999px',
                      padding: '1px 8px',
                      fontSize: '10px',
                      fontWeight: '700',
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {colItems.length}
                  </span>
                  <span
                    style={{
                      color: '#4a5568',
                      fontSize: '10px',
                      fontFamily: "'DM Mono', monospace",
                    }}
                    title="Story Points"
                  >
                    {colPoints}pt
                  </span>
                </div>
              </div>

              {/* Tasks */}
              {colItems.length === 0 && (
                <div
                  style={{
                    border: '1px dashed #2d2d4e',
                    borderRadius: '7px',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#2d2d4e',
                    fontSize: '12px',
                    marginTop: '8px',
                  }}
                >
                  Arrastra aquí
                </div>
              )}
              {colItems.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={onDragStart}
                  onEdit={(t) => setModal({ mode: 'edit', task: t })}
                  onDelete={deleteTask}
                />
              ))}

              {/* Add from column */}
              <button
                onClick={() =>
                  setModal({ mode: 'new', task: { column: col.id } })
                }
                style={{
                  width: '100%',
                  background: 'none',
                  border: '1px dashed #2d2d4e',
                  borderRadius: '7px',
                  color: '#4a5568',
                  padding: '7px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginTop: '6px',
                  transition: 'border-color 0.15s, color 0.15s',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = col.color + '88';
                  e.currentTarget.style.color = col.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2d2d4e';
                  e.currentTarget.style.color = '#4a5568';
                }}
              >
                + Agregar
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          task={
            modal.mode === 'edit'
              ? modal.task
              : modal.task
              ? {
                  ...{
                    title: '',
                    description: '',
                    tags: [],
                    priority: 'medium',
                    sprint: 'Sprint 1',
                    points: 3,
                    assignee: 'Tú',
                  },
                  ...modal.task,
                }
              : null
          }
          onSave={saveTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
