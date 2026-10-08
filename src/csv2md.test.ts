import { describe, expect, it } from "vitest";
import { parseCsv, toMarkdownTable, convertCsvToMd } from "./csv2md.js";

describe("parseCsv", () => {
  it("基础行与列", () => {
    expect(parseCsv("a,b\n1,2")).toEqual([["a", "b"], ["1", "2"]]);
    expect(parseCsv("a,b,c")).toEqual([["a", "b", "c"]]);
    expect(parseCsv("a\nb")).toEqual([["a"], ["b"]]);
  });

  it("单字段与空输入", () => {
    expect(parseCsv("")).toEqual([[""]]);
    expect(parseCsv("abc")).toEqual([["abc"]]);
  });

  it("空单元格", () => {
    expect(parseCsv("a,,c")).toEqual([["a", "", "c"]]);
    expect(parseCsv(",b")).toEqual([["", "b"]]);
    expect(parseCsv("a,")).toEqual([["a", ""]]);
  });

  it("引号包裹", () => {
    expect(parseCsv('"a,b",c')).toEqual([["a,b", "c"]]);
    expect(parseCsv('"a\nb",c')).toEqual([["a\nb", "c"]]);
    expect(parseCsv('"a""b",c')).toEqual([['a"b', "c"]]);
    expect(parseCsv('"a", "b"')).toEqual([["a", " b"]]); // 引号后空格保留
  });

  it("CRLF 行尾", () => {
    expect(parseCsv("a,b\r\n1,2")).toEqual([["a", "b"], ["1", "2"]]);
    expect(parseCsv("a\rb")).toEqual([["a\rb"]]); // 孤立 \r 不当作换行
  });
});

describe("toMarkdownTable", () => {
  it("标准表格", () => {
    const md = toMarkdownTable([["a", "b"], ["1", "2"]]);
    expect(md).toBe("| a | b |\n| --- | --- |\n| 1 | 2 |");
  });

  it("空输入", () => {
    expect(toMarkdownTable([])).toBe("");
  });

  it("管道符转义", () => {
    const md = toMarkdownTable([["h"], ["a|b"]]);
    expect(md).toContain("| a\\|b |");
  });

  it("列数补齐（短行补空）", () => {
    const md = toMarkdownTable([["a", "b"], ["1"]]);
    expect(md).toBe("| a | b |\n| --- | --- |\n| 1 |  |");
  });

  it("仅表头", () => {
    const md = toMarkdownTable([["a", "b"]]);
    expect(md).toBe("| a | b |\n| --- | --- |");
  });
});

describe("convertCsvToMd", () => {
  it("完整转换", () => {
    const md = convertCsvToMd("名称,数量\n苹果,3\n香蕉,5");
    expect(md).toBe("| 名称 | 数量 |\n| --- | --- |\n| 苹果 | 3 |\n| 香蕉 | 5 |");
  });

  it("引号内逗号", () => {
    const md = convertCsvToMd('商品,备注\n"苹果,红",10');
    expect(md).toBe("| 商品 | 备注 |\n| --- | --- |\n| 苹果,红 | 10 |");
  });
});
