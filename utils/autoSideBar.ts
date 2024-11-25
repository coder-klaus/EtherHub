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
  // 存放结果
  const res: SidebarItem[] = [];
  // 开始遍历params
  for (let file in params) {
    // 拼接目录
    const dir = path.join(path1, params[file]);
    // 判断是否是文件夹
    const isDir = isDirectory(dir);
    if (isDir) {
      // 如果是文件夹,读取之后作为下一次递归参数
      const files = fs.readdirSync(dir);
      res.push({
        text: params[file],
        collapsible: true,
        items: getList(files, dir, `${pathname}/${params[file]}`),
      });
    } else {
      // 获取名字
      const name = path.basename(params[file]);
      // 排除非 md 文件
      const suffix = path.extname(params[file]);
      if (suffix !== ".md") {
        continue;
      }
      res.push({
        text: name.slice(4),
        link: `${pathname}/${name}`,
      });
    }
  }
  // 对name做一下处理，把后缀删除
  res.map((item) => {
    item.text = item.text.replace(/\.md$/, "");
  });
  return res;
}

export const set_sidebar = (pathname: string): SidebarItem[] => {
  // 获取pathname的路径
  const dirPath = path.join(DIR_PATH, pathname);
  // 读取pathname下的所有文件或者文件夹
  const files = fs.readdirSync(dirPath);
  // 过滤掉
  const items = intersections(files, WHITE_LIST);
  return getList(items, dirPath, pathname);
};
