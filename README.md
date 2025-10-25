<!-- Centered banner / logo (optional) -->
<p align="center">
  <!-- Put your banner.png in /docs or change the path -->
  <img src="docs/banner.png" alt="Pizza Hub" width="800">
</p>

<h1 align="center">🍕 Pizza Hub — Full Stack Online Ordering System</h1>

<!-- Animated typing title -->
<p align="center">
  <a href="https://github.com/<USER>/<REPO>">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1200&center=true&vCenter=true&width=700&lines=React+%2B+PHP+%2B+MySQL+%2B+Bootstrap;Admin+Dashboard+%7C+Order+Tracking+%7C+Reports;Session-based+Auth+%7C+Clean+Architecture" alt="Typing SVG">
  </a>
</p>

<!-- Shields: Stars / Forks / Watch / Issues / License / Last commit -->
<p align="center">
  <a href="https://github.com/<USER>/<REPO>/stargazers"><img src="https://img.shields.io/github/stars/<USER>/<REPO>?style=for-the-badge" /></a>
  <a href="https://github.com/<USER>/<REPO>/network/members"><img src="https://img.shields.io/github/forks/<USER>/<REPO>?style=for-the-badge" /></a>
  <a href="https://github.com/<USER>/<REPO>/watchers"><img src="https://img.shields.io/github/watchers/<USER>/<REPO>?style=for-the-badge" /></a>
  <a href="https://github.com/<USER>/<REPO>/issues"><img src="https://img.shields.io/github/issues/<USER>/<REPO>?style=for-the-badge" /></a>
  <a href="https://github.com/<USER>/<REPO>/blob/main/LICENSE"><img src="https://img.shields.io/github/license/<USER>/<REPO>?style=for-the-badge" /></a>
  <img src="https://img.shields.io/github/last-commit/<USER>/<REPO>?style=for-the-badge" />
</p>

<!-- Stats: repo size / code size / contributors / downloads (needs releases) -->
<p align="center">
  <img src="https://img.shields.io/github/repo-size/<USER>/<REPO>?style=flat-square" />
  <img src="https://img.shields.io/github/languages/code-size/<USER>/<REPO>?style=flat-square" />
  <img src="https://img.shields.io/github/contributors/<USER>/<REPO>?style=flat-square" />
  <img src="https://img.shields.io/github/downloads/<USER>/<REPO>/total?style=flat-square" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" />
</p>

<!-- Visitors counter (hits) -->
<p align="center">
  <a href="https://github.com/<USER>/<REPO>">
    <img src="https://hits.sh/github.com/<USER>/<REPO>.svg?style=flat-square&label=visits" alt="hits">
  </a>
</p>

<!-- Quick nav -->
<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-folder-structure">Structure</a> •
  <a href="#-database">Database</a> •
  <a href="#-screenshots">Screenshots</a>
</p>



<!-- GitHub Readme Stats -->
<p align="center">
  <img height="165" src="https://github-readme-stats.vercel.app/api?username=<USER>&show_icons=true&theme=default&include_all_commits=true" />
  <img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=<USER>&layout=compact&langs_count=8" />
</p>

<!-- Streak -->
<p align="center">
  <img height="165" src="https://streak-stats.demolab.com?user=<USER>&theme=default" />
</p>

<!-- Activity graph -->
<p align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=<USER>&theme=minimal" />
</p>
## 📚 Motivation
> A complete, self-contained food ordering platform: Users can browse, order, and track deliveries; Admin can manage menu, orders, and reports — all inside one repo, no third-party services.

**Goals**
- Practical full-stack app with sessions, CRUD, RBAC.
- Visual order tracking and admin analytics.
- Clean, scalable structure.

---

## ✨ Features
**User**
- Register/Login/Logout (sessions)
- Browse by categories (Pizza / Fast Food / Drinks)
- Cart (add/remove/review) + Address → Confirm
- Order Confirmation + live status
- **My Orders** page with status stepper

**Admin**
- Dashboard cards (Categories / Products / Users / Today’s Orders)
- Categories & Products CRUD
- Orders: details, update status, notes
- Reports: Daily / Weekly / Monthly
- Auto Invoice (`INV-YYYYMMDD-<id>`)

---

## 🧰 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), Bootstrap 5, Bootstrap Icons |
| Backend | PHP 8.2 (XAMPP), Apache |
| Database | MySQL |
| Auth | PHP Sessions |
| API | REST-like JSON over fetch |

---

## 🚀 How to Run Pizza Hub Project (Step-by-Step)

### 🧩 Prerequisites
Before starting, make sure you have these installed:
1. **Node.js** (v16 or later) → [Download here](https://nodejs.org/)
2. **XAMPP** (includes PHP 8+ and MySQL) → [Download here](https://www.apachefriends.org/)
3. **Git** (optional, for cloning) → [Download here](https://git-scm.com/)

---

### ⚙️ Step 1 — Setup Backend (PHP + MySQL)

1. Open **XAMPP Control Panel** → start:
   - ✅ **Apache**
   - ✅ **MySQL**

2. Copy the backend folder into your XAMPP `htdocs` directory:


3. Open **phpMyAdmin** at [http://localhost/phpmyadmin](http://localhost/phpmyadmin)

4. Create a new database:

5. Import the SQL file:

6. Update your DB credentials in:
Example:
```php
$mysqli = new mysqli("localhost", "root", "", "pizzahub");
$mysqli->set_charset("utf8mb4");
http://localhost/pizzahub-api/public/register.php
{"error": "Method not allowed"}

```
npm run dev
http://localhost:5173



