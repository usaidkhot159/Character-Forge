// ─── State ───
let skills = ['Arcane Surge', 'Time Warp', 'Void Shield'];
let avatarSrc = null;

// ─── Init ───
renderSkills();
bindAll();

function bindAll() {
  ['charName','charClass','charLevel','charRace','charBio','emojiInput'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateCard);
  });
  document.getElementById('charClass').addEventListener('change', function() {
    document.getElementById('customClassRow').style.display = this.value === 'Custom…' ? 'flex' : 'none';
    updateCard();
  });
  document.getElementById('customClass').addEventListener('input', updateCard);
  document.getElementById('avatarInput').addEventListener('change', handleAvatarUpload);

  // Stat range dynamic update
  document.querySelectorAll('input[type="range"]').forEach(r => {
    const id = r.id;
    r.addEventListener('input', function() {
      const map    = { statStr:'fStr', statInt:'fInt', statAgi:'fAgi', statDef:'fDef', statMna:'fMna', statLck:'fLck' };
      const numMap = { statStr:'cStr', statInt:'cInt', statAgi:'cAgi', statDef:'cDef', statMna:'cMna', statLck:'cLck' };
      if (map[id]) {
        document.getElementById(map[id]).style.width = this.value + '%';
        document.getElementById(numMap[id]).textContent = this.value;
      }
    });
  });
}

// ─── Card Update ───
function updateCard() {
  const name  = document.getElementById('charName').value || 'Hero';
  let cls     = document.getElementById('charClass').value;
  if (cls === 'Custom…') cls = document.getElementById('customClass').value || 'Custom Class';
  const level = document.getElementById('charLevel').value || '1';
  const bio   = document.getElementById('charBio').value;
  const emoji = document.getElementById('emojiInput').value || '🧙';

  document.getElementById('cardName').textContent  = name;
  document.getElementById('cardClass').textContent = cls;
  document.getElementById('cardLevel').textContent = level;
  document.getElementById('cardBio').textContent   = bio;

  // Update avatar
  if (avatarSrc) {
    document.getElementById('cardAvatar').innerHTML = `<img src="${avatarSrc}" alt="avatar"/>`;
  } else {
    document.getElementById('cardAvatar').textContent         = emoji;
    document.getElementById('editorAvatarPreview').textContent = emoji;
  }

  // Update stats
  const statKeys = [
    ['Str', 'fStr', 'cStr'],
    ['Int', 'fInt', 'cInt'],
    ['Agi', 'fAgi', 'cAgi'],
    ['Def', 'fDef', 'cDef'],
    ['Mna', 'fMna', 'cMna'],
    ['Lck', 'fLck', 'cLck']
  ];
  statKeys.forEach(([key, fillId, numId]) => {
    const v = document.getElementById(`stat${key}`)?.value || 50;
    document.getElementById(fillId).style.width  = v + '%';
    document.getElementById(numId).textContent   = v;
  });
}

// ─── Skills ───
function addSkill() {
  const inp = document.getElementById('skillInput');
  const val = inp.value.trim();
  if (!val || skills.length >= 10) return;
  if (!skills.includes(val)) {
    skills.push(val);
    renderSkills();
    updateCard();
  }
  inp.value = '';
  inp.focus();
}

function removeSkill(idx) {
  skills.splice(idx, 1);
  renderSkills();
  updateCard();
}

function renderSkills() {
  const container = document.getElementById('skillsPills');
  container.innerHTML = skills.map((s, i) =>
    `<div class="pill">✦ ${s}<span class="pill-remove" onclick="removeSkill(${i})">✕</span></div>`
  ).join('');

  const cardSkills = document.getElementById('cardSkills');
  cardSkills.innerHTML = skills.length
    ? skills.map(s => `<span class="card-pill">${s}</span>`).join('')
    : '<span style="color:rgba(201,168,76,0.3);font-size:0.8rem;font-style:italic">No skills added yet</span>';
}

// ─── Avatar Upload ───
function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    avatarSrc = ev.target.result;
    document.getElementById('editorAvatarPreview').innerHTML =
      `<img src="${avatarSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>`;
    updateCard();
  };
  reader.readAsDataURL(file);
}

// ─── Theme ───
const THEMES = ['arcane','inferno','nature','frost','shadow'];

function setTheme(el, theme, glowColor, glowRgb) {
  document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const card = document.getElementById('characterCard');
  // Remove ALL theme-* classes before adding the new one
  THEMES.forEach(t => card.classList.remove('theme-' + t));
  card.classList.add('theme-' + theme);
  document.getElementById('cardGlow').style.background =
    `radial-gradient(circle,${glowRgb},transparent)`;
}

// ─── Toast ───
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
