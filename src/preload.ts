import { contextBridge, ipcRenderer } from 'electron';
import { readFileSync } from 'fs';
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    let text=readFileSync("src/main.ts").toString().split("\n");
   for(let t of text){
    let div=document.createElement("div");  
    div.innerHTML=t;
    div.onmouseover=function(){
        div.className="highlight";
    }
    div.onmouseout=function(){
        div.className="";
    }
    document.body.appendChild(div);
   }
  });