import{b as n,A as w}from"./index-61f16d08.js";const a=n([]),v=n(null),s=(e,l,t)=>e.slice(0,t)+l+e.slice(t),c=(e,l)=>e.slice(0,l-1)+e.slice(l),f=n(0),b=async e=>{if(e.value.startOffset!==0)a.value[e.value.line].text=c(a.value[e.value.line].text,e.value.startOffset),e.value.startOffset-=1;else{if(a.value[e.value.line].chip){a.value[e.value.line].chip=!1,f.value+=1;return}if(a.value[e.value.line].chip){a.value[e.value.line].chip=!1,f.value+=1;return}if(e.value.line===0)return;await new Promise(l=>setTimeout(l,10)),e.value={line:e.value.line-1,startOffset:a.value[e.value.line-1].text.length,endOffset:a.value[e.value.line-1].text.length},a.value[e.value.line].text+=a.value[e.value.line+1].text,a.value.splice(e.value.line+1,1)}f.value+=1},T=async(e,l)=>{if(v.value==="Dead")switch(e){case"e":e="ê";break;case"o":e="ô";break;case"a":e="â";break;case"u":e="û";break}e==="#"&&l.value.startOffset===0?a.value[l.value.line].bold=!0:e==="*"&&l.value.startOffset===0?a.value[l.value.line].chip=!0:(a.value[l.value.line].text=s(a.value[l.value.line].text,e,l.value.startOffset),await new Promise(t=>setTimeout(t,1)),l.value.startOffset+=1),f.value+=1},g=async e=>{const l=e.value.line,t=e.value.startOffset,u=a.value[e.value.line].text,d=u.slice(0,t),p={index:440,text:u.substring(t,u.length),bold:!1,chip:!1};a.value.splice(l+1,0,p),await new Promise(h=>setTimeout(h,10)),e.value={line:l+1,startOffset:0,endOffset:0},a.value[l].text=d,f.value+=1},O=n(""),x=e=>{const l=a.value[e.value.line].text.slice(e.value.startOffset,e.value.endOffset);O.value=l,console.log("CopiedText : ",l)},m=e=>{x(e);const l=a.value[e.value.line].text,t=e.value.endOffset;e.value.endOffset=e.value.endOffset,a.value[e.value.line].text=l.slice(0,e.value.startOffset)+l.slice(t)},C=e=>{a.value[e.value.line].text=s(a.value[e.value.line].text,O.value,e.value.startOffset),e.value.startOffset+=O.value.length,e.value.endOffset=e.value.startOffset},{launchSnackbar:L}=w(),_=async(e,l)=>{const t=e.key;if(L("event : "+t,"success"),e.preventDefault(),console.log("Keydown : ",t),t==="c"&&v.value==="Control"){x(l),v.value=t;return}if(t==="x"&&v.value==="Control"){m(l),v.value=t;return}if(t==="v"&&v.value==="Control"){C(l),v.value=t;return}t.length===1?await T(t,l):t==="Enter"?await g(l):t==="Backspace"?await b(l):t==="ArrowRight"?l.value.startOffset===a.value[l.value.line].text.length?l.value={line:l.value.line+1,startOffset:1,endOffset:1}:l.value.startOffset+=1:t==="ArrowLeft"&&(l.value.startOffset===0?l.value={line:l.value.line-1,startOffset:a.value[l.value.line-1].text.length,endOffset:a.value[l.value.line-1].text.length}:l.value.startOffset-=1),v.value=t};function k(){return{textLines:a,keydown:_,editCount:f}}export{k as u};