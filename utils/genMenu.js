const fs = require('fs');
const path = require('path');

// 获取当前目录和vaults文件夹路径
const currentDir = process.cwd();
const vaultsDir = path.join(currentDir, 'vaults');
const indexPath = path.join(currentDir, 'index.md');

// 读取vaults文件夹中的文件
fs.readdir(vaultsDir, (err, files) => {
    if (err) {
        console.error('无法读取vaults文件夹:', err);
        return;
    }

    // 过滤出符合格式的文件
    const markdownFiles = files.filter(file => /^\d{3}-.+\.md$/.test(file));

    // 按照文件名前缀排序
    markdownFiles.sort();

    // 构建目录内容
    let content = '# 目录\n\n';
    markdownFiles.forEach((file, index) => {
        const displayName = file.replace(/^\d{3}-/, '').replace('.md', '');
        content += `${index + 1}. [${displayName}](vaults/${file})\n`;
    });

    // 写入index.md文件
    fs.writeFile(indexPath, content, (err) => {
        if (err) {
            console.error('无法写入index.md文件:', err);
            return;
        }
        console.log('index.md文件已成功更新！');
    });
});
