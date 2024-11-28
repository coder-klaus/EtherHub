import path from "node:path";
import fs from "node:fs";

// 文件根目录
const DIR_PATH: string = path.resolve();
// 白名单,过滤不是文章的文件和文件夹
const WHITE_LIST: string[] = [
  "index.md",
  ".vitepress",
  "node_modules",
  ".idea",
  "assets",
  "notes"
];

// 判断是否是文件夹
const isDirectory = (path: string): boolean => fs.lstatSync(path).isDirectory();

// 取差值
const intersections = (arr1: string[], arr2: string[]): string[] =>
  Array.from(new Set(arr1.filter((item) => !new Set(arr2).has(item))));

// 定义 sidebar 项目的类型
interface SidebarItem {
  text: string;
  collapsible?: boolean;
  items?: SidebarItem[];
  link?: string;
}

// 把方法导出直接使用
function getList(params: string[], path1: string, pathname: string): SidebarItem[] {
  const res: SidebarItem[] = [];
  for (let file of params.filter(file => !WHITE_LIST.includes(file))) {
    const dir = path.join(path1, file);
    const isDir = isDirectory(dir);
    if (isDir) {
      const files = fs.readdirSync(dir);
      res.push({
        text: file.slice(4),
        collapsible: true,
        items: getList(files, dir, `${pathname}/${file}`),
      });
    } else {
      const name = path.basename(file);
      const suffix = path.extname(file);
      if (suffix !== ".md") {
        continue;
      }
      res.push({
        text: name.slice(4).replace(/\.md$/, ""),
        link: `${pathname}/${name}`,
      });
    }
  }
  return res;
}

export const set_sidebar = (pathname: string): SidebarItem[] => {
  const dirPath = path.join(DIR_PATH, pathname);
  const files = fs.readdirSync(dirPath);
  const items = intersections(files, WHITE_LIST);
  return getList(items, dirPath, pathname);
};

// 自动读取 docs 目录并生成结构
export const generateSidebarConfig = (): Record<string, SidebarItem[]> => {
  const docsPath = path.join(DIR_PATH, "docs");
  const sections = fs.readdirSync(docsPath).filter((section) => {
    const sectionPath = path.join(docsPath, section);
    return isDirectory(sectionPath) && !WHITE_LIST.includes(section);
  });

  const sidebarConfig: Record<string, SidebarItem[]> = {};
  sections.forEach((section) => {
    const routePath = `/docs/${section}`;
    sidebarConfig[routePath] = set_sidebar(routePath);
  });

  return sidebarConfig;
};
