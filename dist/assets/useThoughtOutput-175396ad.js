import{A as e}from"./index-40ff7ad7.js";const o=async t=>(await e.get("/thought_outputs/"+t+"/thought_input_usages")).data,u=async t=>(await e.post("/thought_input_usages",t)).data;function c(){return{getThoughtInputUsagesForThoughtOutput:o,createThoughtInputUsage:u}}const n=()=>({title:"",description:"",content:"",publishing_state:"",output_type:""}),r=async t=>(await e.get("/thought_outputs/"+t)).data,a=async(t,s)=>(s.progress=Number(s.progress),await e.put("/thought_outputs/"+t,s)),p=async t=>(t.progress=Number(t.progress),(await e.post("/thought_outputs",t)).data);function i(){return{newThoughtOutput:n,getThoughtOutput:r,updateThoughtOutput:a,createThoughtOutput:p}}export{i as a,c as u};
