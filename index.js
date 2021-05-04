const fs = require('fs').promises;
const path = require('path');

async function readdir(rootDir) {
    rootDir = rootDir || path.resolve(__dirname);
    const files = await fs.readdir(rootDir);
    walk(files, rootDir);
}

async function walk(files, rootDir) {
    for (let file of files) {
        const filePullPath = path.resolve(rootDir, file)
        const stats = await fs.stat(filePullPath);

        // lista de itens ignorados
        if (/\.git/g.test(filePullPath)) continue;
        if (/\.node_modules/g.test(filePullPath)) continue;

        if (stats.isDirectory()) {
            readdir(filePullPath);
            continue;
        };
        //lista de itens buscados
        if (!/\.css$/g.test(filePullPath) && !/\.html$/g.test(filePullPath)) continue;

        console.log(filePullPath)
    }
}
urso
readdir('C:/projetos/');
