# Frontier AI Leaderboard

Frontier AI Leaderboard 收集领先语言模型、多模态模型和 Agent 模型公开过的 Benchmark 成绩。这里不计算一个笼统的“总分”。不同 Benchmark 的任务、版本和测评环境差别很大，把它们加权成一个数字通常会掩盖问题。

网站默认按 Benchmark 展示排名。每条成绩保留测评设置和原始链接；同一结果被多处发布时合并来源，数值或 Harness 不一致时则并列保存。

## 当前收录

<!-- DATA_SUMMARY_START -->
- 21 个模型或版本
- 45 个已登记 Benchmark
- 287 条可追溯成绩
- 12 个官方来源
<!-- DATA_SUMMARY_END -->

首版集中在 2026 年仍处于前沿位置的通用、编码、多模态和 Agent 模型，包括 GPT-6 Astra、GPT-5.6 Sol、Claude 5 系列、Gemini 3.8、DeepSeek V4.1、Qwen3.8、GLM-5.3、Seed2.1、Kimi K3 和 Hy4。SkillsBench 1.1 已收录；它的分数按模型与 Agent Harness 分开保存。

这些数字描述当前仓库，不代表覆盖已经完成。模型厂商发布新表，或者 Benchmark 官方榜更新后，记录会继续补充。

## 使用

这是一个没有构建步骤的静态站点。直接打开 `index.html` 即可，也可以运行本地服务器：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

改动数据后运行 `npm run check`。这个命令会检查 ID、引用关系和空分数，并把 README 的收录数量更新为 `data.js` 中的实际值。

仓库保持私有期间，Pages 工作流只允许手动触发。GitHub 个人账户会把私有仓库的 Pages 站点公开发布，因此正式上线前需要先在 Settings > Pages 选择 GitHub Actions，再手动运行 `Deploy GitHub Pages`。

页面有四个视图：

- Leaderboards：选择一个 Benchmark，查看模型排名、模态、测评设置和来源。
- Matrix：横向查看 Benchmark 与模型的覆盖情况。
- Models：核对模型版本、别名、上下文、原生模态和开放方式。
- Sources：查看每个来源支撑了多少条原始记录。

## 数据结构

所有数据在 `data.js` 中：

- `models` 保存模型归属、版本、别名、模态和开放方式。
- `benchmarks` 保存统一后的名称、版本、能力域和指标方向。
- `sources` 保存原始发布页。优先使用模型厂商、Benchmark 官方榜和技术报告。
- `observations` 保存“模型 × Benchmark × 分数 × 口径”记录。

新增数据时，请先确认模型版本和 Benchmark 版本。相同数值且设置一致的来源写进同一条记录的 `sourceIds`。数值不同，或者工具、Harness、推理强度、任务版本不同，就分别建记录并写清 `setting`。新模型没有独立公开分数时可以先登记为 `scoreStatus: "pending"`，不要拿旧版本成绩代替。

模态使用三个值：

- `language`：文本输入，文本输出。
- `vision`：支持文本和视觉输入；是否支持视频或文件在 `modalityDetail` 中说明。
- `omni`：原生支持文本、图像、音频、视频等多种输入。

## 准确性

厂商表里的友商成绩可以入库，但来源会显示为“他测”。Benchmark 官方榜会显示为“Benchmark 官方”。页面不会把这些数据伪装成模型厂商自报。

跨来源排名需要结合设置阅读。即使 Benchmark 名称相同，任务集版本、Agent Harness、工具权限、推理强度和采样次数也可能改变结果。这个项目保存公开证据，不声称做过独立复测。

发现错漏时，请按 [CONTRIBUTING.md](CONTRIBUTING.md) 提交修正。

## License

代码使用 MIT License。各 Benchmark 名称、模型名称和引用内容归原权利人所有。
