import{e as z,r as u,g as P,h as R,m as C,l as W,o as a,c as n,n as D,k as K,F as x,p as g,q as N,b as O,t as V}from"./index-d9814fa1.js";const q=["onClick"],H={key:0,style:{width:"5px"}},M={key:1,style:{height:"25px"}},X={key:2},G=z({__name:"TextInterface",props:{fullText:{}},emits:["change"],setup(_,{emit:b}){const y=_,d=e=>{console.log("selectCursorPosition letter : ",e),r.value={id:e.id,char:e.char}},r=u(null),o=u([]),I=P(()=>T(o.value)),T=e=>{console.log("textArrayFromString textString: ",e);let l=[{id:0,words:[{id:0,text:[]}],text:[]}],t=0,i=0;for(var s=0;s<o.value.length;s++)o.value[s].char==`
`&&(t+=1,i=0,l.push({id:t,words:[{id:0,text:[]}],text:[]})),o.value[s].char==" "&&(i+=1,l[t].words.push({id:i,text:[{id:s,char:o.value[s].char}]})),console.log("LinesIndex : ",t),console.log("wordsIndex : ",i),l[t].words[i].text.push({id:s,char:o.value[s].char});return l},v=e=>{o.value.filter(l=>l.id>=r.value.id+1).forEach(l=>l.id+=1),o.value.splice(r.value.id+1,0,{id:r.value.id+1,char:e,line:0}),r.value.id+=1},F=e=>{if(console.log("Writes : ",e.key),r.value===null)return;const l=e.key;if(h.value&&l=="v"){A();return}if(l.length==1)v(l);else if(l=="Backspace")o.value.splice(r.value.id,1),o.value.filter(t=>t.id>r.value.id).forEach(t=>t.id-=1),r.value.id-=1;else if(l=="Enter")v(`
`);else if(l=="ArrowRight"){let t=r.value.id;t<o.value.length-1&&d(o.value[t+1])}else if(l=="ArrowLeft"){let t=r.value.id;t>0&&d(o.value[t-1])}else l=="Control"&&(console.log("Control"),h.value=!0)},h=u(!1),A=async()=>{try{let l=await navigator.clipboard.readText();console.log("Clippedtext : ",l);for(var e=0;e<l.length;e++)v(l[e])}catch(l){console.log("Error with clippboard : ",l)}},E=e=>{e.key=="Control"&&(h.value=!1)},f=u(!1),p=u({position:"absolute","z-index":90,top:0,left:0,height:"100px",width:"150px"}),B=e=>{e.preventDefault(),p.value.top=`${e.layerY}px`,p.value.left=`${e.layerX}px`,f.value=!0,console.log("event : ",e),console.log("Have a new right click")},m=e=>{if(console.log("textArrayFromString textString: ",e),o.value=[],e===void 0||e==""){o.value=[{id:0,char:`
`}],d({id:0,char:`
`});return}for(var l=0;l<e.length;l++)o.value.push({id:l,char:e[l]})},L=e=>e.reduce((l,t)=>l+t.char,""),k=u(!1);return R(()=>{m(y.fullText),k.value=!0}),C(o,e=>{console.log("Watch triggered : ",e),k.value&&b("change",L(e))},{deep:!0}),C(W(y).fullText,e=>{m(e)}),(e,l)=>(a(),n("div",{class:"border-2 mx-auto relative p-4",tabindex:"0",onKeydown:F,onKeyup:E,onClick:l[0]||(l[0]=t=>f.value=!1)},[f.value?(a(),n("div",{key:0,class:"bg-white border-4",style:D(p.value)},null,4)):K("",!0),(a(!0),n(x,null,g(I.value,(t,i)=>(a(),n("div",{key:i,class:"flex flex-wrap w-full"},[(a(!0),n(x,null,g(t.words,(s,S)=>(a(),n("div",{key:S,class:"flex flex-wrap"},[(a(!0),n(x,null,g(s.text,(c,$)=>{var w;return a(),n("div",{key:$,class:N(["border-blue-400",{"border-r-2":c.id==((w=r.value)==null?void 0:w.id)}]),onClick:Y=>d(c),onContextmenu:B},[c.char==" "?(a(),n("div",H)):c.char==`
`?(a(),n("div",M)):(a(),n("div",X,[O("div",null,V(c.char),1)]))],42,q)}),128))]))),128))]))),128))],32))}});export{G as _};
