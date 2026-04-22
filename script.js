fetch('nav.html').then(r=>r.text()).then(html=>{
document.getElementById('nav').innerHTML = html;
});

function toggleDarkMode(){
document.body.classList.toggle('dark');
localStorage.setItem('dark', document.body.classList.contains('dark'));
}

if(localStorage.getItem('dark')==='true'){
document.body.classList.add('dark');
}

function loadBlogList(){
fetch('posts.json').then(r=>r.json()).then(posts=>{
const c=document.getElementById('blog-list');
if(!c) return;
posts.sort((a,b)=>new Date(b.date)-new Date(a.date));
c.innerHTML=posts.map(p=>`
<div class="card">
<h3><a href="blog.html?post=${p.file}">${p.title}</a></h3>
<p>${p.date}</p>
<p>${p.summary}</p>
</div>`).join('');
});
}

function loadPost(){
const params=new URLSearchParams(window.location.search);
const post=params.get('post');
if(!post) return;
fetch(`blog/${post}`).then(r=>r.text()).then(md=>{
document.getElementById('blog-content').innerHTML=marked.parse(md);
});
}

loadBlogList();
loadPost();
