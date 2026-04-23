function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  fetch(file)
    .then(res => res.text())
    .then(html => el.innerHTML = html)
    .catch(err => console.error(`Failed to load ${file}`, err));
}

function initLayout() {
  loadComponent("nav", "nav.html");
  loadComponent("footer", "footer.html");
}

let reposLoaded = false;

function loadRepos() {
  if (reposLoaded) return;
  reposLoaded = true;

  const container = document.getElementById("repo-list");
  const loading = document.getElementById("loading");

  if (!container) return;

  fetch("repos.json")
    .then(res => res.json())
    .then(data => {
      container.innerHTML = "";

      data
        .filter(r => !r.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .forEach(repo => {
          const d = document.createElement("div");
          d.className = "card";

          d.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description || "No description provided."}</p>
            <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
          `;

          container.appendChild(d);
        });
    })
    .catch(err => {
      container.innerHTML = "<p>Failed to load repositories</p>";
      console.error(err);
    })
    .finally(() => {
      if (loading) loading.remove();
    });
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();

  if (document.getElementById("repo-list")) {
    loadRepos();
  }
});