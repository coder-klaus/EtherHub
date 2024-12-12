import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const docsDir = join(dirname(currentDir), 'docs');

// 更精确的TOC模式匹配
const TOC_PATTERN = /^# [^\n]+\s+\s+\[\[TOC\]\]/m;

async function processMarkdownFile(filePath) {
    try {
        // 读取文件内容
        const content = await readFile(filePath, 'utf-8');

        // 移除BOM和前导空白
        const cleanContent = content.replace(/^\uFEFF/, '').trimStart();

        // 如果已经有TOC格式，跳过
        if (TOC_PATTERN.test(cleanContent)) {
            console.log(`文件已有TOC格式: ${filePath}`);
            return;
        }

        // 获取文件名并移除数字前缀
        const fileName = basename(filePath, '.md').replace(/^\d{3}-/, '');

        // 创建新的TOC头部
        const tocHeader = `# ${fileName}\n\n[[TOC]]\n\n`;

        // 添加TOC头部到文件内容
        const newContent = tocHeader + cleanContent;

        // 写回文件
        await writeFile(filePath, newContent);
        console.log(`已添加TOC: ${filePath}`);
    } catch (err) {
        console.error(`处理文件 ${filePath} 时发生错误:`, err);
    }
}

async function processDirectory(dirPath) {
    try {
        // 检查是否存在vaults目录
        const vaultsDir = join(dirPath, 'vaults');
        let hasVaults = false;
        try {
            const vaultsStat = await stat(vaultsDir);
            hasVaults = vaultsStat.isDirectory();
        } catch (err) {
            return;
        }

        if (!hasVaults) return;

        // 读取vaults文件夹中的所有内容
        const items = await readdir(vaultsDir);

        for (const item of items) {
            const fullPath = join(vaultsDir, item);
            const stats = await stat(fullPath);

            if (stats.isDirectory()) {
                // 如果是目录，递归处理
                await processDirectory(fullPath);
            } else if (stats.isFile() &&
                      item.endsWith('.md') &&
                      item !== 'index.md' &&
                      /^\d{3}-.+\.md$/.test(item)) {
                // 如果是markdown文件且不是index.md，处理它
                await processMarkdownFile(fullPath);
            }
        }
    } catch (err) {
        console.error(`处理目录 ${dirPath} 时发生错误:`, err);
    }
}

async function processAllDocs(rootDir) {
    try {
        // 读取docs目录下的所有内容
        const items = await readdir(rootDir);

        // 处理每个子目录
        for (const item of items) {
            const fullPath = join(rootDir, item);
            const stats = await stat(fullPath);

            if (stats.isDirectory()) {
                await processDirectory(fullPath);
            }
        }

        console.log('所有文档处理完成！');
    } catch (err) {
        console.error('处理文档时发生错误:', err);
    }
}

// 开始处理所有文档
processAllDocs(docsDir);
