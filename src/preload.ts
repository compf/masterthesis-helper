import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';
import os from 'os';
import { get } from 'https';
import {resolve} from 'path';
var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
myConsole.log('Hello World!');
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
console.log("te")
function getAffectedElement(start:HTMLElement){
    let obj=start;
    if(start.tagName=="DIV"){
        return [start];
    }
    let result:HTMLElement[]=[];
    do{
        obj=obj.nextSibling as HTMLElement
        myConsole.log(obj.tagName);
        if(start.tagName!="DIV" && obj.tagName!="DIV" ){
            break;
        }
        result.push(obj);
    }while(true);
    return result;
}
function combineDocuments(content:string){
    let index=0;
    fs.writeFileSync("main.text",content);
    do{
        index=content.indexOf("\\input{");
        if(index!=-1){
            let end=content.indexOf("}",index);
            let path=content.substring(index+"\\input{".length,end);
            myConsole.log("path",path)
            let resolvedPath=resolve(basePath,path+".tex");
            if(fs.existsSync(resolvedPath)){
                //myConsole.log(resolvedPath)
                let fileContent=fs.readFileSync(resolve(basePath,path+".tex")).toString();
                content=content.replace("\\input{"+path+"}",fileContent);
                //myConsole.log("content",content,"###end###")
            }
            else{
                content=content.replace("\\input{"+path+"}","");
            }
            
        }
    }while(index!=-1);
return content;
    
    
  }
  function findDifficultSentences(content:string){
    let splitted=content.split(".");
    let sentencesWithScore:{sentence:string,score:number}[]=[]
    let ignore=["\\item","\\hline","\\lstdefinelanguage{","\\label","\\usepackage"]
    for(let s of splitted){
        if(ignore.some((it)=>s.includes(it))){
            continue;
        }
        let whiteSpaceSplit=s.split(" ");
        let numberWords=whiteSpaceSplit.length;
        let numberLetters=0;
        for(let c of s){
            if(c.match(/[a-zA-Z]/)){
                numberLetters++;
            }
        }
        sentencesWithScore.push({sentence:s,score:numberLetters+numberWords})
    }
    let sorted=sentencesWithScore.sort((a,b)=>b.score-a.score);
    for(let i=0;i<10;i++){
        myConsole.log(sorted[i].sentence,sorted[i].score)
        myConsole.log("################################################################")
    }
  }
  function createHTML(content:string){
    let splitted=content.split(/\.|\n\n/)
    let thesis=document.getElementById("thesis")!;
    for(let s of splitted){
        let tagName="DIV"
        if(s.trim().startsWith("\\chapter")){
            tagName="h1";
        }   
        else if(s.trim().startsWith("\\section")){
            tagName="h2";
        }
        else if(s.trim().startsWith("\\subsection")){
            tagName="h3";
        }
        else if(s.trim().startsWith("\\subsubsection")){
            tagName="h4";
        }

        let div=document.createElement(tagName);  
        div.innerHTML=s;
        div.onmouseover=function(e){
            getAffectedElement(div).forEach((e)=>e.className="highlight")
        }
        div.onmouseout=function(){
            getAffectedElement(div).forEach((e)=>e.className="")
        }
        div.onclick=function(){
            let input=document.getElementById("tbData") as HTMLInputElement
            input.value=getAffectedElement(div).map((e)=>e.innerText).join("\n\n");
        }
       

        
        thesis.appendChild(div);
    }
  }
let basePath="/home/compf/data/uni/master/sem4/schriftlich/master-thesis-report/masterthesis"
if(os.platform()=="win32"){
    basePath="D:\\uni\\master\\master-thesis-report\\masterthesis"
}
window.addEventListener('DOMContentLoaded', () => {
let content=combineDocuments(fs.readFileSync(resolve(basePath,"main.tex")).toString());
fs.writeFileSync("main2.text",content);
findDifficultSentences(content)
 
   
  });
