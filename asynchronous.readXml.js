const fs = require('fs').promises;
const path = require('path');
const xmldom = require('xmldom');

// le o xml doc
xml2json = (xml, { ignoreTags = [] } = {}) => {
    let el = xml.nodeType === 9 ? xml.documentElement : xml
    if (ignoreTags.includes(el.nodeName)) return el

    let h = { _name: el.nodeName }
    h.content = Array.from(el.childNodes || []).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('')
    h.attributes = Array.from(el.attributes || []).filter(a => a).reduce((h, a) => { h[a.name] = a.value; return h }, {})
    h.children = Array.from(el.childNodes || []).filter(n => n.nodeType === 1).map(c => {
        let r = xml2json(c, { ignoreTags: ignoreTags })
        h[c.nodeName] = h[c.nodeName] || r
        return r
    })

    return h
}

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
        if (/\.JAZZ5/g.test(filePullPath)) continue;

        if (stats.isDirectory()) {
            readdir(filePullPath);
            continue;
        };
        //lista de itens buscados
        if (!/\.csproj$/g.test(filePullPath)
            && !/\.vbproj$/g.test(filePullPath)
            && !/\pom.xml$/g.test(filePullPath)
            && !/\.sql$/g.test(filePullPath)
            && !/\.gradle$/g.test(filePullPath)) continue;

        // if (!/\.csproj$/g.test(filePullPath)) continue;

        try {
            const data = fs.readFile(filePullPath, 'utf8')
            data.then(_ => {
                let result = readerXml2json(_);
                let nameRet = result.nameRet;
                let VerRet = result.verRet;
                console.log(filePullPath.slice(filePullPath.lastIndexOf('prd'), filePullPath.length) + ' - ' + nameRet, VerRet);
            }).catch(error => {
                let err = error.message;
            });

        } catch (err) {
            console.error(err)
        }
    }
}
// TODO Criar metodo de escrita para gerar doc

readerXml2json = (xmlentry) => {
    let xml = `${xmlentry}`;
    xml = new xmldom.DOMParser().parseFromString(xml, 'text/xml')

    const item = xml2json(xml);
    let objName,
        objProperties

    for (let i in item) {
        objName = i
        objProperties = item[i]
    }

    // console.log(objName)
    // console.log(objProperties)
    return {
        nameRet: objProperties[1].TargetFrameworkVersion._name,
        verRet: objProperties[1].TargetFrameworkVersion.content
    };
}

readdir('C:/Users/GETRODS/OneDrive - Banco Itaú SA/Desktop/temp/BI2/prd');
