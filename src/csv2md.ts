// csv2md — CSV 转 Markdown 表格（端到端实战验证项目）
// 功能：解析标准 CSV（支持引号包裹、引号内逗号/换行、"" 转义），输出 GFM 表格。

/** 解析 CSV 文本为二维数组（RFC 4180 风格：支持引号包裹、引号内逗号与换行、"" 转义引号） */
export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < input.length) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      if (input[i + 1] === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i += 2;
        continue;
      }
    }
    field += ch;
    i++;
  }
  row.push(field);
  rows.push(row);
  return rows;
}

/** 单元格转义：管道符转义为 \|（GFM 表格要求） */
function escapeCell(cell: string): string {
  return cell.replaceAll("|", "\\|");
}

/** 二维数组 → GFM Markdown 表格（首行作表头，第二行分隔行） */
export function toMarkdownTable(rows: string[][]): string {
  if (rows.length === 0) return "";
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]): string[] => {
    while (r.length < width) r.push("");
    return r;
  };
  const header = pad(rows[0].map(escapeCell));
  const line = `| ${header.join(" | ")} |`;
  const sep = `| ${Array(width).fill("---").join(" | ")} |`;
  const body = rows.slice(1).map((r) => `| ${pad(r.map(escapeCell)).join(" | ")} |`);
  return [line, sep, ...body].join("\n");
}

/** 组合入口：CSV 文本 → Markdown 表格文本 */
export function convertCsvToMd(input: string): string {
  return toMarkdownTable(parseCsv(input));
}
