// ---------- Helpers ----------

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('complete')) return 'status-complete';
  if (s.includes('progress')) return 'status-progress';
  if (s.includes('input') || s.includes('client')) return 'status-input';
  return '';
}

async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    console.error('Could not load', path, err);
    return [];
  }
}

// ---------- Tasks ----------

function renderTasks(tasks, filter) {
  const list = document.getElementById('tasks-list');
  const filtered = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);
  const sorted = [...filtered].sort((a, b) => (a.due || '').localeCompare(b.due || ''));

  if (sorted.length === 0) {
    list.innerHTML = '<p class="empty">Nothing here right now.</p>';
    return;
  }

  list.innerHTML = sorted.map(t => `
    <div class="entry">
      <div class="entry-date">${t.due ? 'Due ' + formatDate(t.due) : ''}</div>
      <div class="entry-body">
        <h3>${t.title}</h3>
        <p class="entry-desc">${t.description || ''}</p>
        <div class="tag-row">
          <span class="tag ${statusClass(t.status)}">${t.status}</span>
          <span class="tag">${t.owner}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function setupTaskFilters(tasks) {
  const statuses = ['All', ...new Set(tasks.map(t => t.status))];
  const container = document.getElementById('task-filters');
  container.innerHTML = statuses.map((s, i) =>
    `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-status="${s}">${s}</button>`
  ).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTasks(tasks, btn.dataset.status);
    });
  });

  renderTasks(tasks, 'All');
}

// ---------- Optimizations ----------

function renderOpts(opts, filter) {
  const list = document.getElementById('opt-list');
  const filtered = filter === 'All' ? opts : opts.filter(o => o.channel === filter);
  const sorted = [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  if (sorted.length === 0) {
    list.innerHTML = '<p class="empty">Nothing logged yet.</p>';
    return;
  }

  list.innerHTML = sorted.map(o => `
    <div class="entry">
      <div class="entry-date">${formatDate(o.date)}</div>
      <div class="entry-body">
        <h3>${o.title}</h3>
        <p class="entry-desc">${o.description || ''}</p>
        <div class="tag-row">
          <span class="tag">${o.channel}</span>
          ${o.impact ? `<span class="impact">${o.impact}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function setupOptFilters(opts) {
  const channels = ['All', ...new Set(opts.map(o => o.channel))];
  const container = document.getElementById('opt-filters');
  container.innerHTML = channels.map((c, i) =>
    `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-channel="${c}">${c}</button>`
  ).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderOpts(opts, btn.dataset.channel);
    });
  });

  renderOpts(opts, 'All');
}

// ---------- Reporting ----------

function renderReports(reports) {
  const list = document.getElementById('report-list');
  const sorted = [...reports]; // assume authored in display order

  if (sorted.length === 0) {
    list.innerHTML = '<p class="empty">No reports posted yet.</p>';
    return;
  }

  list.innerHTML = sorted.map(r => `
    <div class="report-card">
      <div class="report-head">
        <h3>${r.title}</h3>
        ${r.link ? `<a href="${r.link}" target="_blank" rel="noopener">View full report →</a>` : ''}
      </div>
      <div class="report-period">${r.period}</div>
      <p class="report-summary">${r.summary || ''}</p>
      <div class="metrics-row">
        ${(r.metrics || []).map(m => `
          <div>
            <div class="metric-label">${m.label}</div>
            <div class="metric-value">${m.value}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ---------- Init ----------

(async function init() {
  const [tasks, opts, reports] = await Promise.all([
    loadJSON('data/tasks.json'),
    loadJSON('data/optimizations.json'),
    loadJSON('data/reporting.json')
  ]);

  setupTaskFilters(tasks);
  setupOptFilters(opts);
  renderReports(reports);

  const allDates = [...opts.map(o => o.date)].filter(Boolean).sort();
  const latest = allDates[allDates.length - 1];
  document.getElementById('last-updated').textContent = latest
    ? `Last updated ${formatDate(latest)}`
    : '';
})();
