// ── ROADMAP DATA ──
const roadmapData = {
  'Data Analyst': [
    'SQL & Excel Basics', 'Python Fundamentals', 'Statistics',
    'Data Viz', 'BI Tools', 'Dashboard Projects',
    'Tableau / Power BI', 'Domain Analytics', 'Lead Analyst',
    'Analytics Manager', 'Head of Data', 'Chief Data Officer'
  ],
  'Software Engineer': [
    'DSA Basics', 'HTML / CSS / JS', 'Git & Linux',
    'First Framework', 'REST APIs', 'Open Source PRs',
    'System Design', 'Senior Engineer', 'Tech Lead',
    'Engineering Manager', 'VP Engineering', 'CTO'
  ],
  'Product Manager': [
    'User Research', 'Wireframing', 'Agile / Scrum',
    '0–1 Products', 'PRDs & Specs', 'Stakeholder Mgmt',
    'Strategy', 'Senior PM', 'Group PM',
    'Director of PM', 'VP Product', 'Chief Product Officer'
  ],
  'CEO / Founder': [
    'Coding Basics', 'Business Fundamentals', 'First Internship',
    'Side Projects', 'Launch MVP', 'Raise Seed Round',
    'Product-Market Fit', 'Scale Team', 'Series A/B',
    '100Cr Revenue', 'IPO / Exit', 'Vision Leader'
  ],
  'HR Head': [
    'HR Fundamentals', 'Labour Laws', 'Recruitment Basics',
    'HRIS Tools', 'L&D Programs', 'HRBP Role',
    'HR Policy Design', 'Senior HRBP', 'HR Manager',
    'HR Director', 'VP HR', 'CHRO'
  ],
  'Banker': [
    'Finance Basics', 'Excel & VBA', 'CFA Level 1',
    'Internship', 'Analyst Role', 'Financial Modelling',
    'Equity Research', 'Associate', 'VP Investment',
    'Director', 'MD', 'Global Head'
  ],
  'Doctor': [
    'NEET Prep', 'MBBS Year 1–2', 'Clinical Rotations',
    'Internship', 'PG Entrance', 'MD / MS Specialty',
    'Junior Resident', 'Senior Resident', 'Consultant',
    'Associate Prof', 'Head of Dept', 'Medical Director'
  ],
  'Civil Services': [
    'GS Foundation', 'Optional Subject', 'Current Affairs',
    'Prelims Attempt', 'Mains Writing', 'Interview Prep',
    'IAS / IPS / IFS', 'SDM / ASP', 'District Collector',
    'DIG / DM', 'Secretary', 'Chief Secretary'
  ]
};

const phaseLabels = [
  '0–2 yrs · Foundation',
  '2–5 yrs · Entry Level',
  '5–10 yrs · Growth',
  '10–20 yrs · Leadership',
  '20+ yrs · Vision'
];

const phaseTitles = ['Foundation', 'Entry Level', 'Growth', 'Leadership', 'Vision'];

let selectedGoal = null;

// ── NAVIGATION ──
function show(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const navMap = { home: 0, roadmap: 1, dashboard: 2, mentors: 3, institutions: 4, admin: 5, auth: 6 };
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const links = document.querySelectorAll('.nav-link');
  if (navMap[id] !== undefined && links[navMap[id]]) {
    links[navMap[id]].classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── THEME TOGGLE ──
function toggleTheme() {
  const body = document.body;
  const isDark = body.hasAttribute('data-dark');
  isDark ? body.removeAttribute('data-dark') : body.setAttribute('data-dark', '');
  document.getElementById('theme-btn').textContent = isDark ? '☀' : '☾';
}

// ── ROADMAP GOAL SELECTION ──
function selectGoal(el, goal) {
  document.querySelectorAll('.goal-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedGoal = goal;
}

// ── ROADMAP GENERATION ──
function generateRoadmap() {
  const goal = selectedGoal || 'Data Analyst';
  const items = roadmapData[goal] || roadmapData['Data Analyst'];
  const stage = document.getElementById('stage-select').value;
  const perPhase = Math.ceil(items.length / 5);

  const phasesEl = document.getElementById('phases-content');
  phasesEl.innerHTML = '';

  phaseLabels.forEach((lbl, i) => {
    const phaseItems = items.slice(i * perPhase, (i + 1) * perPhase).filter(Boolean);
    const div = document.createElement('div');
    div.className = 'phase';
    div.innerHTML = `
      <div class="phase-label">${lbl}</div>
      <div class="phase-title">${phaseTitles[i]}</div>
      <ul class="phase-items">
        ${phaseItems.map(x => `<li>${x}</li>`).join('')}
      </ul>
    `;
    phasesEl.appendChild(div);
  });

  document.getElementById('roadmap-title').textContent = `${goal} Roadmap`;
  document.getElementById('roadmap-sub').textContent = `Personalised for: ${stage}`;

  const output = document.getElementById('roadmap-output');
  output.classList.add('show');
  setTimeout(() => output.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

// ── AUTH TABS ──
function switchTab(btn, tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('login-form').style.display  = tab === 'login'  ? 'block' : 'none';
}

// ── ROLE SELECTION ──
function selectRole(el) {
  document.querySelectorAll('#role-grid .role-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

// ── DASHBOARD NAV ──
function switchDash(el) {
  document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

// ── PROGRESS BAR ANIMATION ──
function animateProgressBars() {
  document.querySelectorAll('.progress-fill').forEach(fill => {
    const target = fill.getAttribute('data-width') || fill.style.width;
    fill.setAttribute('data-width', target);
    fill.style.width = '0';
    requestAnimationFrame(() => {
      setTimeout(() => { fill.style.width = target; }, 150);
    });
  });
}

// ── ADMIN ACTION BUTTONS ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('approve-btn') || e.target.classList.contains('reject-btn')) {
    const row = e.target.closest('.admin-action-row');
    if (row) {
      row.style.opacity = '0.4';
      row.style.pointerEvents = 'none';
    }
  }
});

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  // Animate progress bars on load
  animateProgressBars();

  // Re-animate when switching to dashboard
  const dashLink = document.querySelectorAll('.nav-link')[2];
  if (dashLink) {
    dashLink.addEventListener('click', () => {
      setTimeout(animateProgressBars, 300);
    });
  }
});
