const xmldom = require('xmldom')

xml2json = (xml, {ignoreTags = []} = {}) => {
  var el = xml.nodeType === 9 ? xml.documentElement : xml
  if (ignoreTags.includes(el.nodeName)) return el

  var h  = {_name: el.nodeName}
  h.content    = Array.from(el.childNodes || []).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('')
  h.attributes = Array.from(el.attributes || []).filter(a => a).reduce((h, a) => { h[a.name] = a.value; return h }, {})
  h.children   = Array.from(el.childNodes || []).filter(n => n.nodeType === 1).map(c => {
    var r = xml2json(c, {ignoreTags: ignoreTags})
    h[c.nodeName] = h[c.nodeName] || r
    return r
  })
  return h
}

xml2json_example = () => {
  var xml = `
  <Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="..\Api.Domain\Domain.csproj" />
    <ProjectReference Include="..\Api.Data\Data.csproj" />
  </ItemGroup>
<ItemGroup>
<PackageReference Include="AutoMapper" Version="10.0.0" />
</ItemGroup>
</Project>
  `
  xml = new xmldom.DOMParser().parseFromString(xml, 'text/xml')
  console.log(xml2json(xml))
}
