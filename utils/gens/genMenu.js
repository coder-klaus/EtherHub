import { readdir, writeFile, stat } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const docsDir = join(dirname(currentDir), 'docs');

async function processDirectory(dirPath) {
    try {
        // 检查是否存在vaults目录
        const vaultsDir = join(dirPath, 'vaults');
        let hasVaults = false;
        try {
            const vaultsStat = await stat(vaultsDir);
            hasVaults = vaultsStat.isDirectory();
        } catch (err) {
            // vaults目录不存在，跳过
            return;
        }

        if (!hasVaults) return;

        // 读取vaults文件夹中的文件和文件夹
        const items = await readdir(vaultsDir);

        // 收集所有项目的信息
        const entries = await Promise.all(
            items.map(async (item) => {
                const fullPath = join(vaultsDir, item);
                const stats = await stat(fullPath);
                return {
                    name: item,
                    isDirectory: stats.isDirectory()
                };
            })
        );

        // 分别处理文件和文件夹
        const markdownEntries = entries
            .filter(entry => {
                if (entry.isDirectory) return true;
                return /^\d{3}-.+\.md$/.test(entry.name);
            })
            .sort((a, b) => a.name.localeCompare(b.name));

        // 构建目录内容
        let content = '# 目录\n\n';
        markdownEntries.forEach((entry, index) => {
            const displayName = entry.name.replace(/^\d{3}-/, '').replace('.md', '');
            const link = entry.isDirectory
                ? `${entry.name}/index.md`
                : `vaults/${entry.name}`;
            content += `${index + 1}. [${displayName}](${link})\n`;
        });

        // 写入index.md文件
        const indexPath = join(dirPath, 'index.md');
        await writeFile(indexPath, content);
        console.log(`已更新: ${indexPath}`);

        // 递归处理子目录
        for (const entry of entries) {
            if (entry.isDirectory) {
                await processDirectory(join(vaultsDir, entry.name));
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

        console.log('所有目录处理完成！');
    } catch (err) {
        console.error('处理文档时发生错误:', err);
    }
}

// 开始处理所有文档
processAllDocs(docsDir);
