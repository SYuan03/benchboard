(() => {
  const data = window.BENCH_DATA;
  const byId = (items) => new Map(items.map((item) => [item.id, item]));
  const modelsById = byId(data.models);
  const benchesById = byId(data.benchmarks);
  const sourcesById = byId(data.sources);
  const modalityLabels = { language: "纯语言", vision: "视觉语言", omni: "全模态" };
  const collectionScopeLabels = {
    dedicated: "专门多模态输入",
    mixed: "混合任务集（含多模态输入）"
  };
  const collectionScopeOrder = { dedicated: 0, mixed: 1 };
  const state = {
    tab: "leaderboard",
    selectedBenchmark: "skillsbench-1-1",
    search: "",
    vendor: "",
    modality: "",
    category: "",
    collection: "",
    conflictsOnly: false,
    compareModelIds: ["qwen3-8-max", "gpt-5-6-sol", "claude-opus-5"],
    compareCommonOnly: true,
    openModelId: ""
  };

  const $ = (selector) => document.querySelector(selector);
  const els = {
    stats: $("#stats"), freshness: $("#freshness"), search: $("#search"),
    vendor: $("#vendor-filter"), modality: $("#modality-filter"), category: $("#category-filter"),
    multimodalHarness: $("#multimodal-harness-filter"), collectionStrip: $("#collection-strip"), clearCollection: $("#clear-collection"),
    conflicts: $("#conflicts-only"), download: $("#download-csv"),
    benchCount: $("#bench-count"), benchmarkNav: $("#benchmark-nav"),
    leaderboardHeading: $("#leaderboard-heading"), leaderboardTable: $("#leaderboard-table"),
    compareModelA: $("#compare-model-a"), compareModelB: $("#compare-model-b"), compareModelC: $("#compare-model-c"),
    compareCommonOnly: $("#compare-common-only"), compareSummary: $("#compare-summary"), compareTable: $("#compare-table"),
    matrixTable: $("#matrix-table"), modelsTable: $("#models-table"), sourcesTable: $("#sources-table"),
    drawer: $("#model-drawer"), drawerBackdrop: $("#model-drawer-backdrop"),
    drawerContent: $("#model-drawer-content"), drawerClose: $("#model-drawer-close")
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const normalize = (value) => String(value ?? "").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, " ").trim();
  const matchesSearch = (haystack, needle) => {
    const text = normalize(haystack);
    const query = normalize(needle);
    if (!query) return true;
    return text.includes(query) || text.replaceAll(" ", "").includes(query.replaceAll(" ", ""));
  };
  const numericValue = (value) => {
    const match = String(value).match(/-?\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : Number.NEGATIVE_INFINITY;
  };
  let drawerReturnFocus = null;

  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("collection") === "multimodal-harness") {
      state.collection = "multimodal-harness";
      state.selectedBenchmark = "wildclawbench-mm";
    }
    if (benchesById.has(params.get("benchmark"))) state.selectedBenchmark = params.get("benchmark");
  }

  function syncUrlState() {
    const params = new URLSearchParams();
    if (state.collection) params.set("collection", state.collection);
    if (state.selectedBenchmark) params.set("benchmark", state.selectedBenchmark);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }

  function coalesceObservations(observations) {
    const groups = new Map();
    observations.forEach((obs) => {
      const key = [obs.benchmarkId, obs.modelId, String(obs.value), obs.unit, obs.setting, obs.note].join("||");
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
      .map((obs) => `${obs.value}|${obs.unit}|${obs.setting}|${obs.note}`)).length > 1;
  }

  function matchesModel(model) {
    if (state.vendor && model.vendorId !== state.vendor) return false;
    if (state.modality && model.modality !== state.modality) return false;
    if (!state.search) return true;
    return matchesSearch([model.name, model.vendor, model.summary, ...(model.aliases || [])].join(" "), state.search);
  }

  function matchesObservation(obs, ignoreCategory = false) {
    const model = modelsById.get(obs.modelId);
    const bench = benchesById.get(obs.benchmarkId);
    if (!model || !bench || !matchesModelWithoutSearch(model)) return false;
    if (!ignoreCategory && state.category && bench.category !== state.category) return false;
    if (state.collection) {
      if (!(bench.collections || []).includes(state.collection)) return false;
    }
    if (!state.search) return true;
    return matchesSearch([bench.name, bench.category, ...(bench.harnesses || []), model.name, model.vendor, obs.setting, obs.note].join(" "), state.search);
  }

  function matchesModelWithoutSearch(model) {
    return (!state.vendor || model.vendorId === state.vendor) && (!state.modality || model.modality === state.modality);
  }

  function filteredObservations(ignoreCategory = false) {
    const visible = observations.filter((obs) => matchesObservation(obs, ignoreCategory));
    if (!state.conflictsOnly) return visible;
    return visible.filter((obs) => conflictFor(obs.benchmarkId, obs.modelId, visible));
  }

  function sourceLinks(obs, model) {
    return obs.sourceIds.map((id) => sourcesById.get(id)).filter(Boolean).map((source) => {
      const own = source.vendorId === model.vendorId;
      const benchmarkOfficial = source.kind === "benchmark";
      const label = own ? `${source.publisher} · 厂商官方` : `${source.publisher} · ${benchmarkOfficial ? "Benchmark 官方" : "他测"}`;
      return `<a class="${own ? "" : "cross"}" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(label)} ↗</a>`;
    }).join("");
  }

  function init() {
    readUrlState();
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
    els.multimodalHarness.classList.toggle("active", state.collection === "multimodal-harness");
    els.multimodalHarness.setAttribute("aria-pressed", String(state.collection === "multimodal-harness"));
    els.collectionStrip.hidden = state.collection !== "multimodal-harness";

    const compareOptions = data.models
      .filter((model) => observations.some((obs) => obs.modelId === model.id))
      .sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name))
      .map((model) => `<option value="${escapeHtml(model.id)}">${escapeHtml(model.name)} · ${escapeHtml(model.vendor)}</option>`).join("");
    els.compareModelA.innerHTML = compareOptions;
    els.compareModelB.innerHTML = compareOptions;
    els.compareModelC.insertAdjacentHTML("beforeend", compareOptions);
    [els.compareModelA.value, els.compareModelB.value, els.compareModelC.value] = state.compareModelIds;
  }

  function benchmarkGroups(pool) {
    const counts = new Map();
    pool.forEach((obs) => counts.set(obs.benchmarkId, (counts.get(obs.benchmarkId) || 0) + 1));
    return data.benchmarks
      .filter((bench) => counts.has(bench.id))
      .sort((a, b) => {
        if (state.collection) {
          return (collectionScopeOrder[a.collectionScope] ?? 9) - (collectionScopeOrder[b.collectionScope] ?? 9) || a.name.localeCompare(b.name);
        }
        return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      })
      .reduce((groups, bench) => {
        const groupName = state.collection ? (collectionScopeLabels[bench.collectionScope] || "其他") : bench.category;
        if (!groups.has(groupName)) groups.set(groupName, []);
        groups.get(groupName).push({ bench, count: counts.get(bench.id) });
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
      ${items.map(({ bench, count }) => `<button class="bench-nav-item ${bench.id === state.selectedBenchmark ? "active" : ""}" type="button" data-benchmark="${escapeHtml(bench.id)}"><span class="bench-nav-copy"><span>${escapeHtml(bench.name)}</span>${state.collection ? `<em>${escapeHtml([`输入：${(bench.inputModalities || []).join(" / ")}`, `Harness：${(bench.harnesses || []).join(" / ")}`].join(" · "))}</em>` : ""}</span><small>${count}</small></button>`).join("")}
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
    const harnessMeta = (bench.harnesses || []).length ? `<span class="chip harness">Harness · ${escapeHtml(bench.harnesses.join(" / "))}</span>` : "";
    const inputMeta = (bench.inputModalities || []).length ? `<span class="chip input-modality">输入 · ${escapeHtml(bench.inputModalities.join(" / "))}</span>` : "";
    const scopeMeta = bench.collectionScope ? `<span class="chip collection-scope">${escapeHtml(collectionScopeLabels[bench.collectionScope])}</span>` : "";
    els.leaderboardHeading.innerHTML = `<div><p class="eyebrow">${escapeHtml(bench.category)}</p><h2>${escapeHtml(bench.name)}</h2><p>${escapeHtml(bench.description)}</p></div><div class="leaderboard-meta">${scopeMeta}${inputMeta}${harnessMeta}<span class="chip green">${rows.length} 条成绩</span>${conflictModels.length ? `<span class="chip orange">${conflictModels.length} 个模型多口径</span>` : ""}<span class="chip ${comparable ? "" : "orange"}">${sortLabel}</span></div>`;
    els.leaderboardTable.innerHTML = `<thead><tr><th class="rank">排名</th><th>模型</th><th>成绩</th><th>模态</th><th>测评设置与备注</th><th>来源</th></tr></thead><tbody>${rows.length ? rows.map((obs, index) => {
      const model = modelsById.get(obs.modelId);
      const conflict = conflictFor(bench.id, model.id, pool);
      const context = [obs.setting, obs.note].filter(Boolean).join(" · ") || "原发布未说明更多设置";
      return `<tr><td class="rank ${comparable && index < 3 ? "top" : ""}">${comparable ? index + 1 : "—"}</td><td class="model-cell"><button class="model-link" type="button" data-model-id="${escapeHtml(model.id)}"><strong>${escapeHtml(model.name)}${conflict ? '<i class="conflict-mark" aria-label="存在多口径结果"></i>' : ""}</strong><small>${escapeHtml(model.vendor)}</small></button></td><td class="score-cell">${escapeHtml(obs.value)}<small>${escapeHtml(obs.unit)}</small></td><td><span class="modality">${escapeHtml(modalityLabels[model.modality])}</span></td><td class="setting-cell">${escapeHtml(context)}</td><td class="source-cell">${sourceLinks(obs, model)}</td></tr>`;
    }).join("") : `<tr><td colspan="6" class="empty">当前筛选下没有成绩。</td></tr>`}</tbody>`;
  }

  function bestObservation(items, direction) {
    return [...items].sort((a, b) => {
      const delta = numericValue(b.value) - numericValue(a.value);
      return direction === "lower" ? -delta : delta;
    })[0];
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
      const best = bestObservation(entries, bench.direction);
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
    if (state.search) sources = sources.filter((source) => matchesSearch([source.title, source.publisher].join(" "), state.search));
    sources.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    els.sourcesTable.innerHTML = `<thead><tr><th>日期</th><th>来源</th><th>发布方</th><th>类型</th><th>引用记录</th></tr></thead><tbody>${sources.length ? sources.map((source) => {
      const count = data.observations.filter((obs) => obs.sourceIds.includes(source.id)).length;
      const type = source.kind === "benchmark" ? "Benchmark 官方" : "模型厂商官方";
      return `<tr><td>${escapeHtml(source.date)}</td><td class="source-title"><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)} ↗</a></td><td>${escapeHtml(source.publisher)}</td><td><span class="modality">${type}</span></td><td>${count} 条</td></tr>`;
    }).join("") : `<tr><td colspan="5" class="empty">没有匹配的来源。</td></tr>`}</tbody>`;
  }

  function representativeObservation(items, bench) {
    return [...items].sort((a, b) => {
      if (typeof a.value !== "number" || typeof b.value !== "number") return String(a.value).localeCompare(String(b.value));
      return bench.direction === "lower" ? a.value - b.value : b.value - a.value;
    })[0];
  }

  function renderCompare() {
    const modelIds = unique(state.compareModelIds).filter((id) => id && modelsById.has(id));
    const pool = filteredObservations();
    const benchIds = unique(pool.filter((obs) => modelIds.includes(obs.modelId)).map((obs) => obs.benchmarkId))
      .filter((benchmarkId) => !state.compareCommonOnly || modelIds.every((modelId) => pool.some((obs) => obs.modelId === modelId && obs.benchmarkId === benchmarkId)))
      .sort((a, b) => {
        const benchA = benchesById.get(a);
        const benchB = benchesById.get(b);
        return benchA.category.localeCompare(benchB.category) || benchA.name.localeCompare(benchB.name);
      });

    const names = modelIds.map((id) => modelsById.get(id).name);
    els.compareSummary.innerHTML = `<span>${names.length} 个模型</span><span>${benchIds.length} 个${state.compareCommonOnly ? "共同" : "相关"} Benchmark</span>${state.category ? `<span>${escapeHtml(state.category)}</span>` : ""}`;
    els.compareTable.innerHTML = `<thead><tr><th>Benchmark</th>${modelIds.map((id) => `<th>${escapeHtml(modelsById.get(id).name)}</th>`).join("")}</tr></thead><tbody>${benchIds.length ? benchIds.map((benchmarkId) => {
      const bench = benchesById.get(benchmarkId);
      return `<tr><td><strong>${escapeHtml(bench.name)}</strong><br><span class="muted">${escapeHtml(bench.category)}</span></td>${modelIds.map((modelId) => {
        const entries = pool.filter((obs) => obs.benchmarkId === benchmarkId && obs.modelId === modelId);
        if (!entries.length) return `<td class="matrix-empty">—</td>`;
        const obs = representativeObservation(entries, bench);
        const context = [obs.setting, obs.note].filter(Boolean).join(" · ") || "原发布未说明更多设置";
        return `<td><span class="compare-value">${escapeHtml(obs.value)} <small>${escapeHtml(obs.unit)}</small></span><span class="compare-context">${escapeHtml(context)}</span><div class="source-cell">${sourceLinks(obs, modelsById.get(modelId))}</div></td>`;
      }).join("")}</tr>`;
    }).join("") : `<tr><td colspan="${modelIds.length + 1}" class="empty">当前筛选下没有共同 Benchmark。</td></tr>`}</tbody>`;
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
      ${modelSource ? `<a class="primary-source" href="${escapeHtml(modelSource.url)}" target="_blank" rel="noreferrer">${modelSource.kind === "benchmark" ? "打开收录依据" : "打开模型官方出处"} ↗</a>` : ""}
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
    renderCompare();
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
    ["leaderboard", "compare", "matrix", "models", "sources"].forEach((name) => {
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
    link.download = `benchboard-${data.meta.updated}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) switchTab(tab.dataset.tab);
    const benchmark = event.target.closest("[data-benchmark]");
    if (benchmark) {
      state.selectedBenchmark = benchmark.dataset.benchmark;
      syncUrlState();
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
  els.multimodalHarness.addEventListener("click", () => {
    state.collection = state.collection === "multimodal-harness" ? "" : "multimodal-harness";
    if (state.collection) state.selectedBenchmark = "wildclawbench-mm";
    els.multimodalHarness.classList.toggle("active", Boolean(state.collection));
    els.multimodalHarness.setAttribute("aria-pressed", String(Boolean(state.collection)));
    els.collectionStrip.hidden = !state.collection;
    render();
    syncUrlState();
  });
  els.clearCollection.addEventListener("click", () => {
    state.collection = "";
    els.multimodalHarness.classList.remove("active");
    els.multimodalHarness.setAttribute("aria-pressed", "false");
    els.collectionStrip.hidden = true;
    render();
    syncUrlState();
  });
  [els.compareModelA, els.compareModelB, els.compareModelC].forEach((select) => select.addEventListener("change", () => {
    state.compareModelIds = [els.compareModelA.value, els.compareModelB.value, els.compareModelC.value];
    renderCompare();
  }));
  els.compareCommonOnly.addEventListener("change", () => { state.compareCommonOnly = els.compareCommonOnly.checked; renderCompare(); });
  els.conflicts.addEventListener("change", () => { state.conflictsOnly = els.conflicts.checked; render(); });
  els.download.addEventListener("click", exportCsv);

  init();
  render();
  syncDrawerFromHash();
})();
