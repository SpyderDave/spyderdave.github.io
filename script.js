/*
========================================
 Shared Component Loader
========================================
*/

function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed loading ${file}`);
      }
      return response.text();
    })
    .then(html => {
      el.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
    });
}

function initLayout() {
  loadComponent("nav", "nav.html");
  loadComponent("footer", "footer.html");
}


/*
========================================
 Repository Loader (GitHub Live)
========================================
*/

let reposLoaded = false;

function loadRepos() {

  // Prevent duplicate rendering
  if (reposLoaded) return;
  reposLoaded = true;

  const container = document.getElementById("repo-list");
  const loading = document.getElementById("loading");

  if (!container) return;

  fetch("https://api.github.com/users/SpyderDave/repos?per_page=100")
    .then(response => {
      if (!response.ok) {
        throw new Error("GitHub API request failed");
      }
      return response.json();
    })

    .then(repos => {

      // Clear loading placeholder content
      container.innerHTML = "";

      repos
        // Hide forks
        .filter(repo => !repo.fork)

        // Most recently updated first
        .sort((a, b) =>
          new Date(b.updated_at) - new Date(a.updated_at)
        )

        .forEach(repo => {

          const card = document.createElement("div");
          card.className = "card";

          card.innerHTML = `
            <h3>
              <a href="${repo.html_url}" target="_blank" rel="noopener">
                ${repo.name}
              </a>
            </h3>

            <p>
              ${repo.description || "No description provided."}
            </p>

            <div class="repo-meta">
              ${
                repo.language
                ? `<span class="badge">${repo.language}</span>`
                : ""
              }

              <span>⭐ ${repo.stargazers_count}</span>
              <span>🍴 ${repo.forks_count}</span>
            </div>
          `;

          container.appendChild(card);

        });

      if (!repos.length) {
        container.innerHTML =
          "<p>No repositories found.</p>";
      }

    })

    .catch(error => {
      console.error("Repository load failed:", error);

      container.innerHTML = `
        <p>
          Could not load repositories.
        </p>
      `;
    })

    .finally(() => {
      // Remove loading message
      if (loading) {
        loading.remove();
      }
    });
}


/*
========================================
 Optional Blog Hooks
(only run if functions exist)
========================================
*/

function initOptionalFeatures() {

  if (typeof loadBlogList === "function") {
    loadBlogList();
  }

  if (typeof loadPost === "function") {
    loadPost();
  }

}


/*
========================================
 App Init
========================================
*/

document.addEventListener("DOMContentLoaded", () => {

  initLayout();

  if (document.getElementById("repo-list")) {
    loadRepos();
  }

  initOptionalFeatures();

});