# csv2md

> 由 clean-code-gauntlet 生成（2026-10-08）｜流水线：six-pack（specifier→coder→cleaner→architect→hardender→QA）｜语言：typescript
> 上游方法论：Bob 大叔（Robert C. Martin）确定性 AI 代码质量体系

---

## 快速开始

```bash
# 1. 安装上游工具（vendor 模式）
/Users/wenjiechen/Doubao/skills/clean-code-gauntlet/tooling/bin/install-tools.sh

# 2. 启动流水线（six-pack（specifier→coder→cleaner→architect→hardender→QA））
get-swarm-forge six-pack
./swarm
```

## 质量关卡（quality-gates/）

本项目已内置确定性质量关卡配置：

| 关卡 | 工具 | 命令（typescript） |
|------|------|------------------|
| 复杂度/CRAP | crapper | `/Users/wenjiechen/Doubao/skills/clean-code-gauntlet/tooling/vendor/crapper/crapper` |
| 变异测试 | mutator | `/Users/wenjiechen/Doubao/skills/clean-code-gauntlet/tooling/vendor/mutator/mutator` |
| 覆盖率 | vitest | `npx vitest run --coverage` |
| 架构约束 | dependency-cruiser | 见 quality-gates/ |

**规则**：Agent 产出的代码必须通过全部关卡才允许交接；CI 再跑一遍兜底。

## 宪法与角色（constitution/ · roles/）

- `constitution/`：三层宪法（project > engineering > workflow），所有 Agent 必读必守；
- `roles/`：六角色 prompts（specifier → coder → cleaner → architect → hardender → QA）；
- 流程：`New Task → specifier → 人工审批 → coder → cleaner → architect → hardender → QA → Done`。

## 人工闸口（不可省略）

1. **specifier 产出（Gherkin + QA 程序）必须人工审批**——业务语义这层由人兜底；
2. **QA 程序必须人审**（彻底或抽查，按关键性分级）；
3. 架构决策由人拍板（审问 Agent → 人设计 → 工具固化）。

## 目录

```
csv2md/
├── README.md / AGENTS.md
├── quality-gates/     # 质量关卡配置
├── constitution/      # 三层宪法
├── roles/             # 六角色 prompts
├── docs/              # 项目文档骨架
├── src/               # 源码（生成后按语言初始化）
└── test/              # 测试（生成后按语言初始化）
```

---

## 本项目：csv2md（CSV → Markdown 表格转换器）

端到端实战验证项目（生成自 clean-code-gauntlet 生成器）。

```bash
# 使用示例
npx vitest run           # 运行测试（12 用例，覆盖 CSV 引号/逗号/换行/转义等边界）

# 一键质检（commit 门：CRAP+覆盖率；merge 门：六维度）
<GAUNTLET_DIR>/tooling/bin/quality-check.sh --stage commit
<GAUNTLET_DIR>/tooling/bin/quality-check.sh --stage merge --with-dry --equiv-ok
```

功能：
- `parseCsv(input)`：RFC 4180 风格 CSV 解析（引号包裹、引号内逗号/换行、`""` 转义引号、CRLF）
- `toMarkdownTable(rows)`：二维数组 → GFM 表格（表头/分隔行/管道符转义/短行补空）
- `convertCsvToMd(input)`：组合入口

实测成绩（2026-10-09）：CRAP 全过、变异 **21/21 全杀 100%**（无等价变异体）、覆盖率 100%、架构 0 违规、DRY 0 候选。
