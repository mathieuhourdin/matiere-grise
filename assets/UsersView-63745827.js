import{d as l,r as d,s as m,o as r,c as i,k as f,w as g,i as s,t,f as v,g as k,F as w,j as y,e as x,p as C}from"./index-074d66c5.js";const U={class:"border shadow-lg rounded p-4"},B={class:"text-right"},b={class:"px-20"},j=["src"],D={class:"text-center mt-4"},A={class:"text-center mt-4"},N={class:"text-center mt-4 text-xs"},V=l({__name:"UserCard",props:{user:{}},setup(_){const o=e=>e?e.length>140?e.slice(0,140)+"...":e:"",a=d("https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg");return(e,n)=>{const c=m("router-link");return r(),i("div",U,[f(c,{to:"/users/"+e.user.id},{default:g(()=>[s("div",B,t(e.user.is_platform_user?"":"externe"),1),s("div",b,[s("img",{src:e.user.profile_picture_url?e.user.profile_picture_url:a.value,class:"border border-slate-300 dark:border-zinc-700 rounded-xl max-w-full aspect-[2/2] object-cover object-center w-full"},null,8,j)]),s("div",D,t(e.user.first_name)+" "+t(e.user.last_name),1),s("div",A,t(e.user.handle),1),s("div",N,t(o(e.user.biography)),1)]),_:1},8,["to"])])}}}),$={class:"m-4"},F={class:"grid grid-cols-1 md:grid-cols-2 gap-8 p-16"},q=l({__name:"UsersView",setup(_){const o=v(),{getUsers:a,createNewDraftUser:e}=x(),n=d([]),c=async()=>{const u=await e();o.push({path:"/users/"+u.id,query:{editingUser:"true"}})};return k(async()=>n.value=await a()),(u,R)=>(r(),i("div",$,[s("div",{class:"underline italic",onClick:c},"Créer un auteur"),s("div",F,[(r(!0),i(w,null,y(n.value,(p,h)=>(r(),C(V,{key:h,user:p},null,8,["user"]))),128))])]))}});export{q as default};
