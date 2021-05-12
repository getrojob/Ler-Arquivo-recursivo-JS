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
    let xml = `
    <?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="15.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <Import Project="$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props" Condition="Exists('$(MSBuildExtensionsPath)\$(MSBuildToolsVersion)\Microsoft.Common.props')" />
  <PropertyGroup>
    <Configuration Condition=" '$(Configuration)' == '' ">Debug</Configuration>
    <Platform Condition=" '$(Platform)' == '' ">AnyCPU</Platform>
    <ProjectGuid>{E472BBC5-EB13-4944-84CC-7C6E3966DEA8}</ProjectGuid>
    <OutputType>Exe</OutputType>
    <RootNamespace>ConsoleConnector</RootNamespace>
    <AssemblyName>ConsoleConnector</AssemblyName>
    <TargetFrameworkVersion>v4.7.2</TargetFrameworkVersion>
    <FileAlignment>512</FileAlignment>
    <AutoGenerateBindingRedirects>true</AutoGenerateBindingRedirects>
    <Deterministic>true</Deterministic>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Debug|AnyCPU' ">
    <PlatformTarget>AnyCPU</PlatformTarget>
    <DebugSymbols>true</DebugSymbols>
    <DebugType>full</DebugType>
    <Optimize>false</Optimize>
    <OutputPath>bin\Debug\</OutputPath>
    <DefineConstants>DEBUG;TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Release|AnyCPU' ">
    <PlatformTarget>AnyCPU</PlatformTarget>
    <DebugType>pdbonly</DebugType>
    <Optimize>true</Optimize>
    <OutputPath>bin\Release\</OutputPath>
    <DefineConstants>TRACE</DefineConstants>
    <ErrorReport>prompt</ErrorReport>
    <WarningLevel>4</WarningLevel>
  </PropertyGroup>
  <ItemGroup>
    <Reference Include="Microsoft.Crm.Sdk.Proxy">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.Crm.Sdk.Proxy.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.IdentityModel.Clients.ActiveDirectory">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.IdentityModel.Clients.ActiveDirectory.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.IdentityModel.Clients.ActiveDirectory.WindowsForms.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.Rest.ClientRuntime">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.Rest.ClientRuntime.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.Xrm.Sdk">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.Xrm.Sdk.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.Xrm.Sdk.Deployment">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.Xrm.Sdk.Deployment.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.Xrm.Tooling.Connector">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.Xrm.Tooling.Connector.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.Xrm.Tooling.CrmConnectControl">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.Xrm.Tooling.CrmConnectControl.dll</HintPath>
    </Reference>
    <Reference Include="Microsoft.Xrm.Tooling.Ui.Styles">
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Microsoft.Xrm.Tooling.Ui.Styles.dll</HintPath>
    </Reference>
    <Reference Include="Newtonsoft.Json, Version=6.0.0.0, Culture=neutral, PublicKeyToken=30ad4fe6b2a6aeed, processorArchitecture=MSIL">
      <SpecificVersion>False</SpecificVersion>
      <HintPath>..\..\..\..\CRM\ScriptAndTools\ScriptsAndTools\Tools\CoreTools\Newtonsoft.Json.dll</HintPath>
    </Reference>
    <Reference Include="System" />
    <Reference Include="System.Configuration" />
    <Reference Include="System.Core" />
    <Reference Include="System.Runtime.Serialization" />
    <Reference Include="System.ValueTuple" />
    <Reference Include="System.Xml.Linq" />
    <Reference Include="System.Data.DataSetExtensions" />
    <Reference Include="Microsoft.CSharp" />
    <Reference Include="System.Data" />
    <Reference Include="System.Net.Http" />
    <Reference Include="System.Xml" />
  </ItemGroup>
  <ItemGroup>
    <Compile Include="Program.cs" />
    <Compile Include="Properties\AssemblyInfo.cs" />
  </ItemGroup>
  <ItemGroup>
    <None Include="App.config" />
  </ItemGroup>
  <Import Project="$(MSBuildToolsPath)\Microsoft.CSharp.targets" />
</Project>
  `
    xml = new xmldom.DOMParser().parseFromString(xml, 'text/xml')


    const ativo = xml2json(xml);
    let objName,
        objProperties

    for (let i in ativo) {
        objName = i
        objProperties = ativo[i]
    }

    // console.log(objName)
    // console.log(objProperties) 
    console.log(objProperties[1].TargetFrameworkVersion._name, objProperties[1].TargetFrameworkVersion.content)

}
xml2json_example();
