(() => {
  const data = window.BENCH_DATA;
  const byId = (items) => new Map(items.map((item) => [item.id, item]));
  const modelsById = byId(data.models);
  const benchesById = byId(data.benchmarks);
  const sourcesById = byId(data.sources);
  const modalityLabels = { language: "纯语言", vision: "视觉语言", omni: "全模态" };
  const state = {
    tab: "leaderboard",
    selectedBenchmark: "skillsbench-1-1",
    search: "",
    vendor: "",
    modality: "",
    category: "",
    conflictsOnly: false,
    openModelId: ""
  };

  const $ = (selector) => document.querySelector(selector);
  const els = {
    stats: $("#stats"), freshness: $("#freshness"), search: $("#search"),
    vendor: $("#vendor-filter"), modality: $("#modality-filter"), category: $("#category-filter"),
    conflicts: $("#conflicts-only"), download: $("#download-csv"),
    benchCount: $("#bench-count"), benchmarkNav: $("#benchmark-nav"),
    leaderboardHeading: $("#leaderboard-heading"), leaderboardTable: $("#leaderboard-table"),
    matrixTable: $("#matrix-table"), modelsTable: $("#models-table"), sourcesTable: $("#sources-table"),
    drawer: $("#model-drawer"), drawerBackdrop: $("#model-drawer-backdrop"),
    drawerContent: $("#model-drawer-content"), drawerClose: $("#model-drawer-close")
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const normalize = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ").trim();
  const numericValue = (value) => {
    const match = String(value).match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : Number.NEGATIVE_INFINITY;
  };
  let drawerReturnFocus = null;

  function coalesceObservations(observations) {
    const groups = new Map();
    observations.forEach((obs) => {
      const key = [obs.benchmarkId, obs.modelId, String(obs.value), obs.unit].join("||");
      if (!groups.has(key)) groups.set(key, { ...obs, sourceIds: [], settings: [], notes: [] });
      const current = groups.get(key);
      current.sourceIds = unique([...current.sourceIds, ...obs.sourceIds]);
      if (obs.setting) current.settings.push(obs.setting);
      if (obs.note) current.notes.push(obs.note);
    });
    return [...groups.values()].map((obs) => ({
      ...obs,
      setting: unique(obs.settings).join(" · "),
      note: unique(obs.notes).join(" · ")
    }));
  }

  const observations = coalesceObservations(data.observations);

  function conflictFor(benchmarkId, modelId, pool = observations) {
    return unique(pool.filter((obs) => obs.benchmarkId === benchmarkId && obs.modelId === modelId)
      .map((obs) => `${obs.value}|${obs.unit}`)).length > 1;
  }

  function matchesModel(model) {
    if (state.vendor && model.vendorId !== state.vendor) return false;
    if (state.modality && model.modality !== state.modality) return false;
    if (!state.search) return true;
    return normalize([model.name, model.vendor, model.summary, ...(model.aliases || [])].join(" ")).includes(normalize(state.search));
  }

  function matchesObservation(obs) {
    const model = modelsById.get(obs.modelId);
    const bench = benchesById.get(obs.benchmarkId);
    if (!model || !bench || !matchesModelWithoutSearch(model)) return false;
    if (state.category && bench.category !== state.category) return false;
    if (!state.search) return true;
    return normalize([bench.name, bench.category, model.name, model.vendor, obs.setting, obs.note].join(" ")).includes(normalize(state.search));
  }

  function matchesModelWithoutSearch(model) {
    return (!state.vendor || model.vendorId === state.vendor) && (!state.modality || model.modality === state.modality);
  }

  function filteredObservations() {
    const visible = observations.filter(matchesObservation);
    if (!state.conflictsOnly) return visible;
    return visible.filter((obs) => conflictFor(obs.benchmarkId, obs.modelId, visible));
  }

  function sourceLinks(obs, model) {
    return obs.sourceIds.map((id) => sourcesById.get(id)).filter(Boolean).map((source) => {
      const own = source.vendorId === model.vendorId;
      const benchmarkOfficial = ["benchflow", "pinchbench", "wildclawbench"].includes(source.vendorId);
      const label = own ? `${source.publisher} · 厂商官方` : `${source.publisher} · ${benchmarkOfficial ? "Benchmark 官方" : "他测"}`;
      return `<a class="${own ? "" : "cross"}" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a>`;
    }).join("");
  }

  function init() {
    const vendors = [...new Map(data.models.map((model) => [model.vendorId, model.vendor])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
    els.vendor.insertAdjacentHTML("beforeend", vendors.map(([id, name]) => `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`).join(""));
    unique(data.benchmarks.map((bench) => bench.category)).sort().forEach((category) => {
      els.category.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`);
    });
    const mergedCount = observations.length;
    const stats = [
      [data.models.length, "模型与版本"],
      [data.benchmarks.length, "已登记 Benchmark"],
      [mergedCount, "去重公开成绩"],
      [data.sources.length, "官方来源"]
    ];
    els.stats.innerHTML = stats.map(([value, label]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join("");
    els.freshness.textContent = `更新于 ${data.meta.updated}`;
  }

  function benchmarkGroups(pool) {
    const counts = new Map();
    pool.forEach((obs) => counts.set(obs.benchmarkId, (counts.get(obs.benchmarkId) || 0) + 1));
    return data.benchmarks
      .filter((bench) => counts.has(bench.id))
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
      .reduce((groups, bench) => {
        if (!groups.has(bench.category)) groups.set(bench.category, []);
        groups.get(bench.category).push({ bench, count: counts.get(bench.id) });
        return groups;
      }, new Map());
  }

  function renderBenchmarkNav() {
    const pool = filteredObservations();
    const groups = benchmarkGroups(pool);
    const available = [...groups.values()].flat().map((item) => item.bench.id);
    if (!available.includes(state.selectedBenchmark)) state.selectedBenchmark = available[0] || "";
    els.benchCount.textContent = String(available.length);
    els.benchmarkNav.innerHTML = [...groups.entries()].map(([category, items]) => `
      <div class="bench-group-title">${escapeHtml(category)}</div>
      ${items.map(({ bench, count }) => `<button class="bench-nav-item ${bench.id === state.selectedBenchmark ? "active" : ""}" type="button" data-benchmark="${escapeHtml(bench.id)}"><span>${escapeHtml(bench.name)}</span><small>${count}</small></button>`).join("")}
    `).join("") || `<div class="empty">没有匹配的 Benchmark</div>`;
  }

  function renderLeaderboard() {
    const pool = filteredObservations();
    renderBenchmarkNav();
    const bench = benchesById.get(state.selectedBenchmark);
    if (!bench) {
      els.leaderboardHeading.innerHTML = `<div><h2>没有匹配结果</h2><p>调整筛选条件后再试。</p></div>`;
      els.leaderboardTable.innerHTML = "";
      return;
    }
    const rows = pool.filter((obs) => obs.benchmarkId === bench.id);
    const comparable = rows.length > 0 && rows.every((obs) => typeof obs.value === "number") && unique(rows.map((obs) => obs.unit)).length === 1;
    rows.sort((a, b) => {
      if (!comparable) return modelsById.get(a.modelId).name.localeCompare(modelsById.get(b.modelId).name);
      const delta = numericValue(b.value) - numericValue(a.value);
      return (bench.direction === "lower" ? -delta : delta) || modelsById.get(a.modelId).name.localeCompare(modelsById.get(b.modelId).name);
    });
    const conflictModels = unique(rows.filter((obs) => conflictFor(bench.id, obs.modelId, pool)).map((obs) => obs.modelId));
    const sortLabel = comparable ? (bench.direction === "lower" ? "低分优先" : "高分优先") : "多口径，仅陈列";
    els.leaderboardHeading.innerHTML = `<div><p class="eyebrow">${escapeHtml(bench.category)}</p><h2>${escapeHtml(bench.name)}</h2><p>${escapeHtml(bench.description)}</p></div><div class="leaderboard-meta"><span class="chip green">${rows.length} 条成绩</span>${conflictModels.length ? `<span class="chip orange">${conflictModels.length} 个模型多口径</span>` : ""}<span class="chip ${comparable ? "" : "orange"}">${sortLabel}</span></div>`;
    els.leaderboardTable.innerHTML = `<thead><tr><th class="rank">排名</th><th>模型</th><th>成绩</th><th>模态</th><th>测评设置与备注</th><th>来源</th></tr></thead><tbody>${rows.length ? rows.map((obs, index) => {
      const model = modelsById.get(obs.modelId);
      const conflict = conflictFor(bench.id, model.id, pool);
      const context = [obs.setting, obs.note].filter(Boolean).join(" · ") || "原发布未说明更多设置";
      return `<tr><td class="rank ${comparable && index < 3 ? "top" : ""}">${comparable ? index + 1 : "—"}</td><td class="model-cell"><button class="model-link" type="button" data-model-id="${escapeHtml(model.id)}"><strong>${escapeHtml(model.name)}${conflict ? '<i class="conflict-mark" aria-label="存在多口径结果"></i>' : ""}</strong><small>${escapeHtml(model.vendor)}</small></button></td><td class="score-cell">${escapeHtml(obs.value)}<small>${escapeHtml(obs.unit)}</small></td><td><span class="modality">${escapeHtml(modalityLabels[model.modality])}</span></td><td class="setting-cell">${escapeHtml(context)}</td><td class="source-cell">${sourceLinks(obs, model)}</td></tr>`;
    }).join("") : `<tr><td colspan="6" class="empty">当前筛选下没有成绩。</td></tr>`}</tbody>`;
  }

  function bestObservation(items) {
    return [...items].sort((a, b) => numericValue(b.value) - numericValue(a.value))[0];
  }

  function renderMatrix() {
    const pool = filteredObservations();
    const modelIds = unique(pool.map((obs) => obs.modelId));
    const benchIds = unique(pool.map((obs) => obs.benchmarkId));
    const models = data.models.filter((model) => modelIds.includes(model.id)).sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name));
    const benches = data.benchmarks.filter((bench) => benchIds.includes(bench.id)).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    els.matrixTable.innerHTML = `<thead><tr><th>Benchmark</th>${models.map((model) => `<th>${escapeHtml(model.name)}</th>`).join("")}</tr></thead><tbody>${benches.map((bench) => `<tr><td><strong>${escapeHtml(bench.name)}</strong><br><span class="muted">${escapeHtml(bench.category)}</span></td>${models.map((model) => {
      const entries = pool.filter((obs) => obs.benchmarkId === bench.id && obs.modelId === model.id);
      if (!entries.length) return `<td class="matrix-empty">—</td>`;
      const best = bestObservation(entries);
      const conflict = conflictFor(bench.id, model.id, pool);
      const title = [best.setting, best.note].filter(Boolean).join(" · ");
      return `<td title="${escapeHtml(title)}"><span class="matrix-value">${escapeHtml(best.value)}</span> <span class="muted">${escapeHtml(best.unit)}</span>${conflict ? '<i class="conflict-mark" aria-label="存在多口径结果"></i>' : ""}</td>`;
    }).join("")}</tr>`).join("") || `<tr><td class="empty">没有匹配的数据。</td></tr>`}</tbody>`;
  }

  function renderModels() {
    const models = data.models.filter(matchesModel).sort((a, b) => String(b.releaseDate).localeCompare(String(a.releaseDate)));
    els.modelsTable.innerHTML = `<thead><tr><th>模型</th><th>厂商</th><th>模态</th><th>输入 / 输出</th><th>上下文</th><th>发布日期</th><th>开放方式</th><th>成绩</th></tr></thead><tbody>${models.length ? models.map((model) => {
      const source = sourcesById.get(model.sourceId);
      const count = observations.filter((obs) => obs.modelId === model.id).length;
      const status = model.scoreStatus === "pending" ? '<span class="status-pending">待补</span>' : model.scoreStatus === "base-model" ? '<span class="status-base">底座模型</span>' : `${count} 条`;
      return `<tr class="model-row" data-model-id="${escapeHtml(model.id)}"><td class="model-title"><button class="model-row-button" type="button" data-model-id="${escapeHtml(model.id)}" aria-label="查看 ${escapeHtml(model.name)} 的全部 Benchmark"><strong>${escapeHtml(model.name)}</strong><span class="muted">${escapeHtml((model.aliases || []).join(" · "))}</span></button></td><td>${escapeHtml(model.vendor)}</td><td><span class="modality">${escapeHtml(modalityLabels[model.modality])}</span></td><td>${escapeHtml(model.modalityDetail)}</td><td>${escapeHtml(model.context)}</td><td>${escapeHtml(model.releaseDate)}</td><td>${escapeHtml(model.access)}</td><td>${status}<br><span class="detail-hint">查看详情 →</span>${source ? `<br><a class="muted" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">模型出处 ↗</a>` : ""}</td></tr>`;
    }).join("") : `<tr><td colspan="8" class="empty">没有匹配的模型。</td></tr>`}</tbody>`;
  }

  function renderSources() {
    let sources = [...data.sources];
    if (state.search) sources = sources.filter((source) => normalize([source.title, source.publisher].join(" ")).includes(normalize(state.search)));
    sources.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    els.sourcesTable.innerHTML = `<thead><tr><th>日期</th><th>来源</th><th>发布方</th><th>类型</th><th>引用记录</th></tr></thead><tbody>${sources.length ? sources.map((source) => {
      const count = data.observations.filter((obs) => obs.sourceIds.includes(source.id)).length;
      return `<tr><td>${escapeHtml(source.date)}</td><td class="source-title"><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)} ↗</a></td><td>${escapeHtml(source.publisher)}</td><td><span class="modality">官方发布</span></td><td>${count} 条</td></tr>`;
    }).join("") : `<tr><td colspan="5" class="empty">没有匹配的来源。</td></tr>`}</tbody>`;
  }

  function renderModelDrawer(model) {
    const rows = observations
      .filter((obs) => obs.modelId === model.id)
      .sort((a, b) => {
        const benchA = benchesById.get(a.benchmarkId);
        const benchB = benchesById.get(b.benchmarkId);
        return benchA.category.localeCompare(benchB.category) || benchA.name.localeCompare(benchB.name) || String(a.setting).localeCompare(String(b.setting));
      });
    const groups = rows.reduce((result, obs) => {
      const bench = benchesById.get(obs.benchmarkId);
      if (!result.has(bench.category)) result.set(bench.category, []);
      result.get(bench.category).push({ obs, bench });
      return result;
    }, new Map());
    const modelSource = sourcesById.get(model.sourceId);
    els.drawerContent.innerHTML = `
      <header class="drawer-hero">
        <p class="eyebrow">${escapeHtml(model.vendor)} · ${escapeHtml(modalityLabels[model.modality])}</p>
        <h2 id="model-drawer-title">${escapeHtml(model.name)}</h2>
        <p>${escapeHtml(model.summary)}</p>
        <div class="drawer-badges"><span>${rows.length} 条公开记录</span><span>${unique(rows.map((row) => row.benchmarkId)).length} 个 Benchmark</span><span>${escapeHtml(model.access)}</span></div>
      </header>
      <dl class="model-meta">
        <div><dt>原生模态</dt><dd>${escapeHtml(model.modalityDetail)}</dd></div>
        <div><dt>上下文</dt><dd>${escapeHtml(model.context)}</dd></div>
        <div><dt>发布日期</dt><dd>${escapeHtml(model.releaseDate)}</dd></div>
        <div><dt>别名 / API 名</dt><dd>${escapeHtml((model.aliases || []).join(" · ") || "—")}</dd></div>
      </dl>
      ${modelSource ? `<a class="primary-source" href="${escapeHtml(modelSource.url)}" target="_blank" rel="noreferrer">打开模型官方出处 ↗</a>` : ""}
      <div class="drawer-results">
        ${rows.length ? [...groups.entries()].map(([category, items]) => `
          <section class="result-group">
            <div class="result-group-head"><h3>${escapeHtml(category)}</h3><span>${items.length}</span></div>
            ${items.map(({ obs, bench }) => {
              const context = [obs.setting, obs.note].filter(Boolean).join(" · ") || "原发布未说明更多设置";
              return `<article class="result-card"><div class="result-score"><strong>${escapeHtml(obs.value)}</strong><span>${escapeHtml(obs.unit)}</span></div><div class="result-copy"><h4>${escapeHtml(bench.name)}</h4><p>${escapeHtml(context)}</p><div class="source-cell">${sourceLinks(obs, model)}</div></div></article>`;
            }).join("")}
          </section>
        `).join("") : `<div class="drawer-empty"><strong>尚无独立公开成绩</strong><p>模型已登记，但不会拿其他版本或服务版的成绩代替。</p></div>`}
      </div>`;
  }

  function openModelDrawer(modelId, updateHash = true) {
    const model = modelsById.get(modelId);
    if (!model) return;
    drawerReturnFocus = document.activeElement;
    state.openModelId = modelId;
    renderModelDrawer(model);
    els.drawer.hidden = false;
    els.drawerBackdrop.hidden = false;
    els.drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("drawer-open");
    if (updateHash && location.hash !== `#model=${encodeURIComponent(modelId)}`) history.pushState(null, "", `#model=${encodeURIComponent(modelId)}`);
    els.drawerClose.focus();
  }

  function closeModelDrawer(updateHash = true) {
    if (!state.openModelId) return;
    state.openModelId = "";
    els.drawer.hidden = true;
    els.drawerBackdrop.hidden = true;
    els.drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");
    if (updateHash && location.hash.startsWith("#model=")) history.pushState(null, "", `${location.pathname}${location.search}`);
    if (drawerReturnFocus && document.contains(drawerReturnFocus)) drawerReturnFocus.focus();
  }

  function syncDrawerFromHash() {
    const params = new URLSearchParams(location.hash.slice(1));
    const modelId = params.get("model");
    if (modelId && modelsById.has(modelId)) openModelDrawer(modelId, false);
    else closeModelDrawer(false);
  }

  function render() {
    renderLeaderboard();
    renderMatrix();
    renderModels();
    renderSources();
  }

  function switchTab(tab) {
    state.tab = tab;
    document.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    ["leaderboard", "matrix", "models", "sources"].forEach((name) => {
      $(`#panel-${name}`).hidden = name !== tab;
    });
  }

  function exportCsv() {
    let rows = filteredObservations();
    if (state.tab === "leaderboard" && state.selectedBenchmark) rows = rows.filter((obs) => obs.benchmarkId === state.selectedBenchmark);
    const header = ["benchmark", "category", "model", "vendor", "modality", "score", "unit", "setting", "notes", "source_publishers", "source_urls"];
    const body = rows.map((obs) => {
      const model = modelsById.get(obs.modelId);
      const bench = benchesById.get(obs.benchmarkId);
      const sources = obs.sourceIds.map((id) => sourcesById.get(id)).filter(Boolean);
      return [bench.name, bench.category, model.name, model.vendor, modalityLabels[model.modality], obs.value, obs.unit, obs.setting, obs.note, sources.map((source) => source.publisher).join(" | "), sources.map((source) => source.url).join(" | ")];
    });
    const quote = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [header, ...body].map((row) => row.map(quote).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `frontier-ai-leaderboard-${data.meta.updated}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) switchTab(tab.dataset.tab);
    const benchmark = event.target.closest("[data-benchmark]");
    if (benchmark) {
      state.selectedBenchmark = benchmark.dataset.benchmark;
      renderLeaderboard();
    }
    const modelTarget = event.target.closest("[data-model-id]");
    if (modelTarget && !event.target.closest("a")) openModelDrawer(modelTarget.dataset.modelId);
    if (event.target === els.drawerBackdrop || event.target.closest("#model-drawer-close")) closeModelDrawer();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.openModelId) closeModelDrawer();
  });
  window.addEventListener("hashchange", syncDrawerFromHash);
  els.search.addEventListener("input", () => { state.search = els.search.value; render(); });
  els.vendor.addEventListener("change", () => { state.vendor = els.vendor.value; render(); });
  els.modality.addEventListener("change", () => { state.modality = els.modality.value; render(); });
  els.category.addEventListener("change", () => { state.category = els.category.value; render(); });
  els.conflicts.addEventListener("change", () => { state.conflictsOnly = els.conflicts.checked; render(); });
  els.download.addEventListener("click", exportCsv);

  init();
  render();
  syncDrawerFromHash();
})();
