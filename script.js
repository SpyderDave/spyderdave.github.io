
function loadComponent(id,file){
const el=document.getElementById(id);
if(!el)return;
fetch(file).then(r=>r.text()).then(h=>el.innerHTML=h);
}
function initLayout(){
loadComponent("nav","nav.html");
loadComponent("footer","footer.html");
}
let reposLoaded=false;
function loadRepos(){
if(reposLoaded)return;
reposLoaded=true;
const c=document.getElementById("repo-list");
const loading=document.getElementById("loading");
fetch("repos.json")
.then(r=>r.json())
.then(data=>{
c.innerHTML="";
data.forEach(repo=>{
let d=document.createElement("div");
d.className="card";
d.innerHTML=`<h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
<p>${repo.description}</p>`;
c.appendChild(d);
});
})
.catch(()=>{c.innerHTML="<p>Failed to load repositories</p>";})
.finally(()=>{if(loading)loading.remove();});
}
document.addEventListener("DOMContentLoaded",()=>{
initLayout();
if(document.getElementById("repo-list")) loadRepos();
});
