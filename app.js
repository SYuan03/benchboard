(() => {
  const data = window.BENCH_DATA;
  const byId = (items) => new Map(items.map((item) => [item.id, item]));
  const modelsById = byId(data.models);
  const benchesById = byId(data.benchmarks);
  const sourcesById = byId(data.sources);
  const sourceAuditsById = new Map((data.sourceAudits || []).map((audit) => [audit.sourceId, audit]));
  const declaredFamilies = data.benchmarkFamilies || [];
  const familyByBenchmarkId = new Map();
  declaredFamilies.forEach((family) => family.variants.forEach((variant) => familyByBenchmarkId.set(variant.benchmarkId, family)));
  const familyForBenchmark = (benchmarkId) => {
    const bench = benchesById.get(benchmarkId);
    return familyByBenchmarkId.get(benchmarkId) || {
      id: benchmarkId,
      name: bench?.name || benchmarkId,
      variants: [{ benchmarkId, label: "Overall" }]
    };
  };
  const variantForBenchmark = (benchmarkId) => familyForBenchmark(benchmarkId).variants.find((variant) => variant.benchmarkId === benchmarkId);
  const allBenchmarkFamilies = [
    ...declaredFamilies,
    ...data.benchmarks.filter((bench) => !familyByBenchmarkId.has(bench.id)).map((bench) => familyForBenchmark(bench.id))
  ];
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
    const family = familyForBenchmark(obs.benchmarkId);
    const variant = variantForBenchmark(obs.benchmarkId);
    if (!model || !bench || !matchesModelWithoutSearch(model)) return false;
    if (!ignoreCategory && state.category && bench.category !== state.category) return false;
    if (state.collection) {
      if (!(bench.collections || []).includes(state.collection)) return false;
    }
    if (!state.search) return true;
    return matchesSearch([family.name, variant?.label, bench.name, bench.category, ...(bench.harnesses || []), model.name, model.vendor, obs.setting, obs.note].join(" "), state.search);
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

  function modelReferenceSources(model) {
    return unique([model.sourceId, ...(model.referenceSourceIds || [])])
      .map((sourceId) => sourcesById.get(sourceId))
      .filter(Boolean);
  }

  function sourceAuditLabel(sourceId) {
    const audit = sourceAuditsById.get(sourceId);
    if (audit?.status === "complete") return { label: audit.scopeLabel || "整表已核", className: "complete" };
    if (audit?.status === "target-complete") return { label: audit.scopeLabel || "目标列已核", className: "target" };
    if (audit?.status === "metadata-only") return { label: "非成绩页", className: "metadata" };
    if (audit?.status === "partial") return { label: "部分录入", className: "partial" };
    return { label: "待核", className: "pending" };
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
      [allBenchmarkFamilies.length, "已登记 Benchmark"],
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

  function visibleFamilyItems(pool) {
    const counts = new Map();
    pool.forEach((obs) => counts.set(obs.benchmarkId, (counts.get(obs.benchmarkId) || 0) + 1));
    return allBenchmarkFamilies.map((family) => {
      const variants = family.variants.filter((variant) => counts.has(variant.benchmarkId));
      if (!variants.length) return null;
      const benches = variants.map((variant) => benchesById.get(variant.benchmarkId)).filter(Boolean);
      const scopes = unique(benches.map((bench) => bench.collectionScope));
      const category = benches[0]?.category || "其他";
      const groupName = state.collection
        ? (scopes.length > 1 ? "同时提供专项与混合榜" : (collectionScopeLabels[scopes[0]] || "其他"))
        : category;
      return {
        family,
        variants,
        benches,
        groupName,
        count: variants.reduce((sum, variant) => sum + counts.get(variant.benchmarkId), 0)
      };
    }).filter(Boolean);
  }

  function benchmarkGroups(pool) {
    return visibleFamilyItems(pool)
      .sort((a, b) => {
        if (state.collection) {
          const aScope = Math.min(...a.benches.map((bench) => collectionScopeOrder[bench.collectionScope] ?? 9));
          const bScope = Math.min(...b.benches.map((bench) => collectionScopeOrder[bench.collectionScope] ?? 9));
          return aScope - bScope || a.family.name.localeCompare(b.family.name);
        }
        return a.groupName.localeCompare(b.groupName) || a.family.name.localeCompare(b.family.name);
      })
      .reduce((groups, item) => {
        if (!groups.has(item.groupName)) groups.set(item.groupName, []);
        groups.get(item.groupName).push(item);
        return groups;
      }, new Map());
  }

  function renderBenchmarkNav() {
    const pool = filteredObservations();
    const groups = benchmarkGroups(pool);
    const available = [...groups.values()].flat().flatMap((item) => item.variants.map((variant) => variant.benchmarkId));
    if (!available.includes(state.selectedBenchmark)) state.selectedBenchmark = available[0] || "";
    els.benchCount.textContent = String([...groups.values()].flat().length);
    els.benchmarkNav.innerHTML = [...groups.entries()].map(([category, items]) => `
      <div class="bench-group-title">${escapeHtml(category)}</div>
      ${items.map(({ family, variants, benches, count }) => {
        const active = variants.some((variant) => variant.benchmarkId === state.selectedBenchmark);
        const target = active ? state.selectedBenchmark : variants[0].benchmarkId;
        const inputs = unique(benches.flatMap((bench) => bench.inputModalities || []));
        const harnesses = unique(benches.flatMap((bench) => bench.harnesses || []));
        const detail = state.collection ? [`输入：${inputs.join(" / ")}`, `Harness：${harnesses.join(" / ")}`].join(" · ") : "";
        const countLabel = variants.length > 1 ? `${variants.length} 指标` : `${count} 条`;
        return `<button class="bench-nav-item ${active ? "active" : ""}" type="button" data-benchmark="${escapeHtml(target)}"><span class="bench-nav-copy"><span>${escapeHtml(family.name)}</span>${detail ? `<em>${escapeHtml(detail)}</em>` : ""}</span><small>${escapeHtml(countLabel)}</small></button>`;
      }).join("")}
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
    const family = familyForBenchmark(bench.id);
    const visibleVariants = family.variants.filter((variant) => pool.some((obs) => obs.benchmarkId === variant.benchmarkId));
    const selectedVariant = variantForBenchmark(bench.id);
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
    const variantNav = visibleVariants.length > 1 ? `<div class="benchmark-variants" aria-label="${escapeHtml(family.name)} 指标切换">${visibleVariants.map((variant) => {
      const count = pool.filter((obs) => obs.benchmarkId === variant.benchmarkId).length;
      return `<button class="benchmark-variant ${variant.benchmarkId === bench.id ? "active" : ""}" type="button" data-benchmark="${escapeHtml(variant.benchmarkId)}">${escapeHtml(variant.label)}<small>${count}</small></button>`;
    }).join("")}</div>` : "";
    els.leaderboardHeading.innerHTML = `<div class="leaderboard-title"><p class="eyebrow">${escapeHtml(bench.category)}</p><h2>${escapeHtml(family.name)}</h2>${variantNav}<p><strong class="selected-variant">${escapeHtml(selectedVariant?.label || "Overall")}</strong>${escapeHtml(bench.description)}</p></div><div class="leaderboard-meta">${scopeMeta}${inputMeta}${harnessMeta}<span class="chip green">${rows.length} 条成绩</span>${conflictModels.length ? `<span class="chip orange">${conflictModels.length} 个模型多口径</span>` : ""}<span class="chip ${comparable ? "" : "orange"}">${sortLabel}</span></div>`;
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
    const models = data.models.filter((model) => modelIds.includes(model.id)).sort((a, b) => a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name));
    const families = visibleFamilyItems(pool).sort((a, b) => a.groupName.localeCompare(b.groupName) || a.family.name.localeCompare(b.family.name));
    els.matrixTable.innerHTML = `<thead><tr><th>Benchmark</th>${models.map((model) => `<th>${escapeHtml(model.name)}</th>`).join("")}</tr></thead><tbody>${families.map(({ family, variants, benches }) => `<tr><td><strong>${escapeHtml(family.name)}</strong><br><span class="muted">${escapeHtml(unique(benches.map((bench) => bench.category)).join(" / "))}${variants.length > 1 ? ` · ${variants.length} 指标` : ""}</span></td>${models.map((model) => {
      const metrics = variants.map((variant) => {
        const bench = benchesById.get(variant.benchmarkId);
        const entries = pool.filter((obs) => obs.benchmarkId === bench.id && obs.modelId === model.id);
        if (!entries.length) return "";
        const best = bestObservation(entries, bench.direction);
        const conflict = conflictFor(bench.id, model.id, pool);
        const title = [best.setting, best.note].filter(Boolean).join(" · ");
        return `<div class="matrix-metric" title="${escapeHtml(title)}">${variants.length > 1 ? `<span class="metric-label">${escapeHtml(variant.label)}</span>` : ""}<span class="matrix-value">${escapeHtml(best.value)}</span> <span class="muted">${escapeHtml(best.unit)}</span>${conflict ? '<i class="conflict-mark" aria-label="存在多口径结果"></i>' : ""}</div>`;
      }).filter(Boolean);
      return metrics.length ? `<td>${metrics.join("")}</td>` : `<td class="matrix-empty">—</td>`;
    }).join("")}</tr>`).join("") || `<tr><td class="empty">没有匹配的数据。</td></tr>`}</tbody>`;
  }

  function renderModels() {
    const models = data.models.filter(matchesModel).sort((a, b) => String(b.releaseDate).localeCompare(String(a.releaseDate)));
    els.modelsTable.innerHTML = `<thead><tr><th>模型</th><th>厂商</th><th>模态</th><th>输入 / 输出</th><th>上下文</th><th>发布日期</th><th>开放方式</th><th>成绩</th></tr></thead><tbody>${models.length ? models.map((model) => {
      const source = sourcesById.get(model.sourceId);
      const count = observations.filter((obs) => obs.modelId === model.id).length;
      const status = model.scoreStatus === "pending"
        ? '<span class="status-pending">待补</span>'
        : model.scoreStatus === "base-model"
          ? `<span class="status-base">底座模型</span><br>${count} 条`
          : model.scoreStatus === "comparison-only"
            ? `<span class="status-comparison">对照记录</span><br>${count} 条`
            : `${count} 条`;
      return `<tr class="model-row" data-model-id="${escapeHtml(model.id)}"><td class="model-title"><button class="model-row-button" type="button" data-model-id="${escapeHtml(model.id)}" aria-label="查看 ${escapeHtml(model.name)} 的全部 Benchmark"><strong>${escapeHtml(model.name)}</strong><span class="muted">${escapeHtml((model.aliases || []).join(" · "))}</span></button></td><td>${escapeHtml(model.vendor)}</td><td><span class="modality">${escapeHtml(modalityLabels[model.modality])}</span></td><td>${escapeHtml(model.modalityDetail)}</td><td>${escapeHtml(model.context)}</td><td>${escapeHtml(model.releaseDate)}</td><td>${escapeHtml(model.access)}</td><td>${status}<br><span class="detail-hint">查看详情 →</span>${source ? `<br><a class="muted" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">模型出处 ↗</a>` : ""}</td></tr>`;
    }).join("") : `<tr><td colspan="8" class="empty">没有匹配的模型。</td></tr>`}</tbody>`;
  }

  function renderSources() {
    let sources = [...data.sources];
    if (state.search) sources = sources.filter((source) => matchesSearch([source.title, source.publisher].join(" "), state.search));
    sources.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    els.sourcesTable.innerHTML = `<thead><tr><th>日期</th><th>来源</th><th>发布方</th><th>类型</th><th>覆盖审计</th><th>引用记录</th></tr></thead><tbody>${sources.length ? sources.map((source) => {
      const count = data.observations.filter((obs) => obs.sourceIds.includes(source.id)).length;
      const type = source.kind === "benchmark" ? "Benchmark 官方" : "模型厂商官方";
      const audit = sourceAuditsById.get(source.id);
      const targetAuditCount = audit?.targetModels?.length || (audit?.targetModelId ? 1 : 0);
      const targetObservationCount = audit?.targetModels
        ? audit.targetModels.reduce((sum, target) => sum + (target.expectedObservationCount || 0), 0)
        : audit?.expectedTargetObservationCount || 0;
      const auditCell = audit?.status === "complete"
        ? `<span class="audit-complete" title="${escapeHtml(audit.note || "")}">${escapeHtml(audit.scopeLabel || "公开成绩表已核")} · ${(audit.benchmarkIds || []).length} 项 / ${audit.expectedObservationCount ?? 0} 条</span>`
        : audit?.status === "target-complete"
          ? `<span class="audit-target" title="${escapeHtml(audit.note || "")}">${escapeHtml(audit.scopeLabel || "目标模型列已核")} · ${targetAuditCount} 个模型 / ${targetObservationCount} 条</span>`
        : audit?.status === "partial"
          ? `<span class="audit-partial" title="${escapeHtml(audit.note || "")}">部分录入</span>`
          : audit?.status === "metadata-only"
            ? `<span class="audit-metadata" title="${escapeHtml(audit.note || "")}">非成绩页</span>`
            : `<span class="muted" title="${escapeHtml(audit?.note || "")}">待整表核对</span>`;
      return `<tr><td>${escapeHtml(source.date)}</td><td class="source-title"><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)} ↗</a></td><td>${escapeHtml(source.publisher)}</td><td><span class="modality">${type}</span></td><td>${auditCell}</td><td>${count} 条</td></tr>`;
    }).join("") : `<tr><td colspan="6" class="empty">没有匹配的来源。</td></tr>`}</tbody>`;
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
    const benchIdSet = new Set(benchIds);
    const families = allBenchmarkFamilies.map((family) => {
      const variants = family.variants.filter((variant) => benchIdSet.has(variant.benchmarkId));
      if (!variants.length) return null;
      const benches = variants.map((variant) => benchesById.get(variant.benchmarkId));
      return { family, variants, benches };
    }).filter(Boolean).sort((a, b) => a.benches[0].category.localeCompare(b.benches[0].category) || a.family.name.localeCompare(b.family.name));

    const names = modelIds.map((id) => modelsById.get(id).name);
    els.compareSummary.innerHTML = `<span>${names.length} 个模型</span><span>${families.length} 个${state.compareCommonOnly ? "共同" : "相关"} Benchmark</span>${state.category ? `<span>${escapeHtml(state.category)}</span>` : ""}`;
    els.compareTable.innerHTML = `<thead><tr><th>Benchmark</th>${modelIds.map((id) => `<th>${escapeHtml(modelsById.get(id).name)}</th>`).join("")}</tr></thead><tbody>${families.length ? families.map(({ family, variants, benches }) => `<tr><td><strong>${escapeHtml(family.name)}</strong><br><span class="muted">${escapeHtml(unique(benches.map((bench) => bench.category)).join(" / "))}${variants.length > 1 ? ` · ${variants.length} 指标` : ""}</span></td>${modelIds.map((modelId) => {
      const metrics = variants.map((variant) => {
        const bench = benchesById.get(variant.benchmarkId);
        const entries = pool.filter((obs) => obs.benchmarkId === bench.id && obs.modelId === modelId);
        if (!entries.length) return "";
        const obs = representativeObservation(entries, bench);
        const context = [obs.setting, obs.note].filter(Boolean).join(" · ") || "原发布未说明更多设置";
        return `<div class="compare-metric">${variants.length > 1 ? `<span class="metric-label">${escapeHtml(variant.label)}</span>` : ""}<span class="compare-value">${escapeHtml(obs.value)} <small>${escapeHtml(obs.unit)}</small></span><span class="compare-context">${escapeHtml(context)}</span><div class="source-cell">${sourceLinks(obs, modelsById.get(modelId))}</div></div>`;
      }).filter(Boolean);
      return metrics.length ? `<td>${metrics.join("")}</td>` : `<td class="matrix-empty">—</td>`;
    }).join("")}</tr>`).join("") : `<tr><td colspan="${modelIds.length + 1}" class="empty">当前筛选下没有共同 Benchmark。</td></tr>`}</tbody>`;
  }

  function renderModelDrawer(model) {
    const rows = observations
      .filter((obs) => obs.modelId === model.id)
      .sort((a, b) => {
        const benchA = benchesById.get(a.benchmarkId);
        const benchB = benchesById.get(b.benchmarkId);
        return benchA.category.localeCompare(benchB.category) || benchA.name.localeCompare(benchB.name) || String(a.setting).localeCompare(String(b.setting));
      });
    const familyResults = rows.reduce((result, obs) => {
      const bench = benchesById.get(obs.benchmarkId);
      const family = familyForBenchmark(bench.id);
      if (!result.has(family.id)) result.set(family.id, { family, items: [] });
      result.get(family.id).items.push({ obs, bench, variant: variantForBenchmark(bench.id) });
      return result;
    }, new Map());
    const groups = [...familyResults.values()].sort((a, b) => a.family.name.localeCompare(b.family.name)).reduce((result, familyResult) => {
      const categories = unique(familyResult.family.variants.map((variant) => benchesById.get(variant.benchmarkId)?.category));
      const category = categories.join(" / ");
      if (!result.has(category)) result.set(category, []);
      result.get(category).push(familyResult);
      return result;
    }, new Map());
    const modelSources = modelReferenceSources(model);
    els.drawerContent.innerHTML = `
      <header class="drawer-hero">
        <p class="eyebrow">${escapeHtml(model.vendor)} · ${escapeHtml(modalityLabels[model.modality])}</p>
        <h2 id="model-drawer-title">${escapeHtml(model.name)}</h2>
        <p>${escapeHtml(model.summary)}</p>
        <div class="drawer-badges"><span>${rows.length} 条公开记录</span><span>${familyResults.size} 个 Benchmark</span><span>${escapeHtml(model.access)}</span></div>
      </header>
      <dl class="model-meta">
        <div><dt>原生模态</dt><dd>${escapeHtml(model.modalityDetail)}</dd></div>
        <div><dt>上下文</dt><dd>${escapeHtml(model.context)}</dd></div>
        <div><dt>发布日期</dt><dd>${escapeHtml(model.releaseDate)}</dd></div>
        <div><dt>别名 / API 名</dt><dd>${escapeHtml((model.aliases || []).join(" · ") || "—")}</dd></div>
      </dl>
      ${modelSources.length ? `<div class="model-reference-list"><strong>模型资料与核对状态</strong>${modelSources.map((source) => {
        const audit = sourceAuditLabel(source.id);
        return `<a class="primary-source" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer"><span>${escapeHtml(source.title)} ↗</span><small class="source-audit-pill ${escapeHtml(audit.className)}">${escapeHtml(audit.label)}</small></a>`;
      }).join("")}</div>` : ""}
      <div class="drawer-results">
        ${rows.length ? [...groups.entries()].map(([category, families]) => `
          <section class="result-group">
            <div class="result-group-head"><h3>${escapeHtml(category)}</h3><span>${families.length} Benchmark</span></div>
            ${families.map(({ family, items }) => `<div class="result-family"><div class="result-family-head"><h4>${escapeHtml(family.name)}</h4>${family.variants.length > 1 ? `<span>${items.length} 记录 · ${unique(items.map((item) => item.bench.id)).length} 指标</span>` : ""}</div>${items.map(({ obs, variant }) => {
              const context = [obs.setting, obs.note].filter(Boolean).join(" · ") || "原发布未说明更多设置";
              return `<article class="result-card"><div class="result-score"><strong>${escapeHtml(obs.value)}</strong><span>${escapeHtml(obs.unit)}</span></div><div class="result-copy">${family.variants.length > 1 ? `<h5>${escapeHtml(variant?.label || "Overall")}</h5>` : ""}<p>${escapeHtml(context)}</p><div class="source-cell">${sourceLinks(obs, model)}</div></div></article>`;
            }).join("")}</div>`).join("")}
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
