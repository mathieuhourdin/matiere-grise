import{j as e}from"./index-b043677b.js";const o=async(r,t="ppdc")=>(await e.post(`/file_conversion?target_format=${t}`,r,"multipart/form-data")).data;function a(){return{postFileConversion:o}}export{a as u};