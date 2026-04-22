// Load nav + highlight active page
fetch('nav.html')
.then(r=>r.text())
.then(html=>{
  const navContainer = document.getElementById('nav');
  if(!navContainer) return;

  navContainer.innerHTML = html;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const links = navContainer.querySelectorAll('a');
  links.forEach(link=>{
    const href = link.getAttribute('href');
    if(href === currentPage){
      link.classList.add('active');
    }
  });
});

// Dark mode
function toggleDarkMode(){
  document.body.classList.toggle('dark');
  localStorage.setItem('dark', document.body.classList.contains('dark'));
}

// Persist dark mode
if(localStorage.getItem('dark') === 'true'){
  document.body.classList.add('dark');
}

// Load repos (simple list, no filters)
function loadRepos(){
 fetch('repos.json')
 .then(r=>r.json())
 .then(data=>{
  const c=document.getElementById('repo-list');
  if(!c) return;

  data
    .filter(r=>!r.fork)
    .sort((a,b)=> new Date(b.updated_at)-new Date(a.updated_at))
    .forEach(repo=>{
      const d=document.createElement('div');
      d.className='card';

      d.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || "No description provided."}</p>
        <div>
          ${repo.language ? `<span class="badge">${repo.language}</span>`:''}
          ${repo.featured ? `<span class="badge">⭐ Featured</span>`:''}
        </div>
        <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
      `;

      c.appendChild(d);
    });
 });
}

// Blog list
function loadBlogList(){
 fetch('posts.json')
 .then(r=>r.json())
 .then(posts=>{
  const c=document.getElementById('blog-list');
  if(!c) return;

  posts.sort((a,b)=> new Date(b.date)-new Date(a.date));

  c.innerHTML = posts.map(p=>`
    <div class="card">
      <h3><a href="blog.html?post=${p.file}">${p.title}</a></h3>
      <p>${p.date}</p>
      <p>${p.summary}</p>
    </div>
  `).join('');
 });
}

// Load single blog post
function loadPost(){
 const params=new URLSearchParams(window.location.search);
 const post=params.get('post');
 if(!post) return;

 fetch(`blog/${post}`)
 .then(r=>r.text())
 .then(md=>{
  if(typeof marked !== "undefined"){
    document.getElementById('blog-content').innerHTML = marked.parse(md);
  }
 });
}

// Init
loadRepos();
loadBlogList();
loadPost();