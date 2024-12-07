import fs from 'fs';
import os from 'os';
import { resolve } from 'path';
import { NumberWordsPlusLettersMetric } from './TextMetric';
import { SentenceSplitter, ParagraphSplitter, LatexSectionSplitter } from './TextSplitter';
const myConsole = console
const ignore = ["\\item", "\\hline", "\\lstdefinelanguage{", "\\label", "\\usepackage", "\\acro", "section{", "\\chapter", "\\begin", "\\today", "\\end", "\\print"]

function combineDocuments(content: string) {
  let index = 0;
  fs.writeFileSync("main.text", content);
  do {
    index = content.indexOf("\\input{");
    if (index != -1) {
      let end = content.indexOf("}", index);
      let path = content.substring(index + "\\input{".length, end);
      myConsole.log("path", path)
      let resolvedPath = resolve(basePath, path + ".tex");
      if (fs.existsSync(resolvedPath)) {
        //myConsole.log(resolvedPath)
        let fileContent = fs.readFileSync(resolve(basePath, path + ".tex")).toString();
        content = content.replace("\\input{" + path + "}", fileContent);
        //myConsole.log("content",content,"###end###")
      }
      else {
        content = content.replace("\\input{" + path + "}", "");
      }

    }
  } while (index != -1);
  return content;


}

let metrics = [new NumberWordsPlusLettersMetric()]
let splitters = [new SentenceSplitter(), new ParagraphSplitter(), new LatexSectionSplitter()]
function findDifficultSentences(content: string) {
  let result: { [key: string]: {score:number,sentence:string}[] } = {}
  for (let s of splitters) {
    let splitted = s.split(content);
    for (let sentence of splitted) {
      if (s.shallIgnore(sentence)) {
        continue;
      }
      for (let metric of metrics) {
        let key = metric.getName() + " " + s.getName();
        if (!result[key]) {
          result[key] = [];
        }
        let res={score:metric.measure(sentence),sentence:sentence};
        result[key].push(res);
      }

    }
    
  }

  for(let key in result){
    result[key]=result[key].sort((a,b)=>b.score-a.score);
    result[key]=result[key].slice(0,10);
    for(let res of result[key]){
      console.log(key)
      console.log(res.score)
      console.log(res.sentence)
    }
    console.log("##################")
    
  }
  fs.writeFileSync("result.json", JSON.stringify(result,undefined,2));
}


let basePath = "/home/compf/data/uni/master/sem4/schriftlich/master-thesis-report/masterthesis"
if (os.platform() == "win32") {
  basePath = "D:\\uni\\master\\master-thesis-report\\masterthesis"
}
let content = combineDocuments(fs.readFileSync(resolve(basePath, "main.tex")).toString());
fs.writeFileSync("main2.text", content);
findDifficultSentences(content)


