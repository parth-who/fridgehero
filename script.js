// ✅ No API key here — lives safely in backend/.env

// ── State ──
let servings = 2;
let currentRecipe = null;
let savedRecipes = JSON.parse(localStorage.getItem('fridgeHeroSaved') || '[]');

// ── Init ──
updateSavedCount();

// ── Chip toggle (diet/meal/time = multi, cuisine = single) ──
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const cb = chip.querySelector('input[type="checkbox"]');
    if (cb.name === 'cuisine') {
      document.querySelectorAll('input[name="cuisine"]').forEach(c => {
        c.checked = false;
        c.closest('.chip').classList.remove('active');
      });
      cb.checked = true;
      chip.classList.add('active');
    } else if (cb.name === 'time') {
      document.querySelectorAll('input[name="time"]').forEach(c => {
        c.checked = false;
        c.closest('.chip').classList.remove('active');
      });
      cb.checked = true;
      chip.classList.add('active');
    } else if (cb.name === 'meal') {
      document.querySelectorAll('input[name="meal"]').forEach(c => {
        c.checked = false;
        c.closest('.chip').classList.remove('active');
      });
      cb.checked = true;
      chip.classList.add('active');
    } else {
      cb.checked = !cb.checked;
      chip.classList.toggle('active', cb.checked);
    }
  });
});

// ── Servings ──
document.getElementById('incBtn').addEventListener('click', () => {
  if (servings < 12) { servings++; document.getElementById('servingVal').textContent = servings; }
});
document.getElementById('decBtn').addEventListener('click', () => {
  if (servings > 1) { servings--; document.getElementById('servingVal').textContent = servings; }
});

// ── Cook button ──
document.getElementById('cookBtn').addEventListener('click', generateRecipe);

async function generateRecipe() {
  const ing1 = document.getElementById('ing1').value.trim();
  const ing2 = document.getElementById('ing2').value.trim();
  const ing3 = document.getElementById('ing3').value.trim();

  if (!ing1 || !ing2 || !ing3) { showError('Please enter all 3 ingredients.'); return; }

  const diets   = Array.from(document.querySelectorAll('input[name="diet"]:checked')).map(c => c.value);
  const cuisine = document.querySelector('input[name="cuisine"]:checked')?.value || null;
  const meal    = document.querySelector('input[name="meal"]:checked')?.value || null;
  const time    = document.querySelector('input[name="time"]:checked')?.value || null;

  const prompt = `You are a creative Michelin-star chef. Given these 3 main ingredients: ${ing1}, ${ing2}, ${ing3}, create a delicious recipe.

${diets.length ? `CRITICAL dietary restrictions (strictly follow): ${diets.join(', ')}. Do NOT include any violating ingredients.` : ''}
${cuisine ? `Cuisine style: ${cuisine}.` : ''}
${meal ? `Meal type: ${meal}.` : ''}
${time ? `Must be ready in: ${time}.` : ''}
Servings: ${servings} ${servings === 1 ? 'person' : 'people'}.

Respond ONLY with valid JSON, no markdown, no backticks, no explanation:
{
  "dishName": "Creative dish name",
  "cookTime": "e.g. 25 minutes",
  "difficulty": "Easy | Medium | Hard",
  "calories": "estimated calories per serving as a number only e.g. 420",
  "protein": "estimated protein per serving as a number only e.g. 32",
  "carbs": "estimated carbs per serving as a number only e.g. 28",
  "fat": "estimated fat per serving as a number only e.g. 14",
  "steps": [
    { "title": "Step title", "detail": "Clear, detailed instruction for this step." },
    { "title": "Step title", "detail": "Clear, detailed instruction for this step." },
    { "title": "Step title", "detail": "Clear, detailed instruction for this step." },
    { "title": "Step title", "detail": "Clear, detailed instruction for this step." },
    { "title": "Step title", "detail": "Clear, detailed instruction for this step." },
    { "title": "Step title", "detail": "Clear, detailed instruction for this step." }
  ]
}`;

  const btn      = document.getElementById('cookBtn');
  const loading  = document.getElementById('loading');
  const result   = document.getElementById('result');
  const errorMsg = document.getElementById('errorMsg');

  btn.disabled = true;
  loading.style.display = 'block';
  result.style.display  = 'none';
  errorMsg.style.display = 'none';

  try {
    // ── Call your Express backend (key stays secret in .env) ──
    let response;
    try {
      response = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
    } catch (netErr) {
      throw new Error('❌ Cannot connect to server.\n\nRun this in your terminal:\ncd backend\nnpm run dev\n\nThen open: http://localhost:3000');
    }

    // ── Read body safely ──
    const rawText = await response.text();

    if (!response.ok) {
      if (response.status === 405) {
        throw new Error('405 Error: Open http://localhost:3000 — not Live Server (port 5500)');
      }
      let msg = 'Server error ' + response.status;
      try { msg = JSON.parse(rawText).error || msg; } catch (_) {}
      throw new Error(msg);
    }

    let data;
    try { data = JSON.parse(rawText); }
    catch (_) { throw new Error('Server returned invalid response. Check terminal for errors.'); }

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error('Empty response from AI. Try again.');

    text = text.replace(/```json\s*/g, '').replace(/```/g, '').trim();

    let recipe;
    try { recipe = JSON.parse(text); }
    catch (_) { throw new Error('AI returned malformed data. Try again.'); }

    // ── Store for save feature ──
    currentRecipe = { recipe, diets, cuisine, meal, servings, ing1, ing2, ing3, savedAt: Date.now() };

    // ── Render ──
    renderRecipe(recipe, diets, cuisine);

    result.style.display = 'block';
    document.getElementById('saveBtn').classList.remove('saved');
    document.getElementById('saveBtn').textContent = '🔖 Save';
    setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);

  } catch (err) {
    showError(err.message);
    console.error(err);
  } finally {
    btn.disabled = false;
    loading.style.display = 'none';
  }
}

function renderRecipe(recipe, diets, cuisine) {
  document.getElementById('dishName').textContent = recipe.dishName;

  // Meta info
  const meta = document.getElementById('recipeMeta');
  meta.innerHTML = '';
  if (recipe.cookTime) meta.innerHTML += `<span>⏱️ ${recipe.cookTime}</span>`;
  if (recipe.difficulty) meta.innerHTML += `<span>📊 ${recipe.difficulty}</span>`;
  meta.innerHTML += `<span>👥 ${servings} serving${servings > 1 ? 's' : ''}</span>`;

  // Nutrition bar
  const nutBar = document.getElementById('nutritionBar');
  if (recipe.calories) {
    nutBar.innerHTML = `
      <div class="nut-item"><div class="nut-val">${recipe.calories}</div><div class="nut-label">Calories</div></div>
      <div class="nut-divider"></div>
      <div class="nut-item"><div class="nut-val">${recipe.protein}g</div><div class="nut-label">Protein</div></div>
      <div class="nut-divider"></div>
      <div class="nut-item"><div class="nut-val">${recipe.carbs}g</div><div class="nut-label">Carbs</div></div>
      <div class="nut-divider"></div>
      <div class="nut-item"><div class="nut-val">${recipe.fat}g</div><div class="nut-label">Fat</div></div>`;
    nutBar.classList.add('visible');
  } else {
    nutBar.classList.remove('visible');
  }

  // Tags
  const tagsEl = document.getElementById('appliedTags');
  tagsEl.innerHTML = '';
  diets.forEach(d => {
    const s = document.createElement('span');
    s.className = 'applied-tag';
    s.textContent = '✓ ' + d;
    tagsEl.appendChild(s);
  });
  if (cuisine) {
    const s = document.createElement('span');
    s.className = 'applied-tag cuisine';
    s.textContent = cuisine + ' style';
    tagsEl.appendChild(s);
  }

  // Steps
  const container = document.getElementById('stepsContainer');
  container.innerHTML = '';
  recipe.steps.forEach((step, i) => {
    const item = document.createElement('div');
    item.className = 'step-item';
    item.style.animationDelay = (i * 0.08) + 's';
    item.innerHTML =
      '<div class="step-num-col">' +
        '<div class="step-circle">' + (i + 1) + '</div>' +
        '<div class="step-line"></div>' +
      '</div>' +
      '<div class="step-body">' +
        '<div class="step-title">' + escapeHtml(step.title) + '</div>' +
        '<div class="step-detail">' + escapeHtml(step.detail) + '</div>' +
      '</div>';
    container.appendChild(item);
  });
}

// ── Save recipe ──
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!currentRecipe) return;
  savedRecipes.unshift(currentRecipe);
  if (savedRecipes.length > 20) savedRecipes = savedRecipes.slice(0, 20);
  localStorage.setItem('fridgeHeroSaved', JSON.stringify(savedRecipes));
  updateSavedCount();
  const btn = document.getElementById('saveBtn');
  btn.textContent = '✅ Saved!';
  btn.classList.add('saved');
});

// ── Copy recipe ──
document.getElementById('copyBtn').addEventListener('click', () => {
  if (!currentRecipe) return;
  const r = currentRecipe.recipe;
  let text = `🍳 ${r.dishName}\n`;
  if (r.cookTime) text += `⏱️ ${r.cookTime} | 📊 ${r.difficulty}\n`;
  if (r.calories) text += `Nutrition: ${r.calories} cal | ${r.protein}g protein | ${r.carbs}g carbs | ${r.fat}g fat\n`;
  text += `\nIngredients: ${currentRecipe.ing1}, ${currentRecipe.ing2}, ${currentRecipe.ing3}\n\nSteps:\n`;
  r.steps.forEach((s, i) => { text += `${i + 1}. ${s.title}: ${s.detail}\n`; });
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyBtn');
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = '📋 Copy', 2000);
  });
});

// ── Print recipe ──
document.getElementById('printBtn').addEventListener('click', () => window.print());

// ── New recipe ──
document.getElementById('newRecipeBtn').addEventListener('click', generateRecipe);

// ── Saved drawer ──
document.getElementById('openDrawerBtn').addEventListener('click', openDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
document.getElementById('drawerOverlay').addEventListener('click', closeDrawer);

function openDrawer() {
  renderSavedList();
  document.getElementById('savedDrawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}
function closeDrawer() {
  document.getElementById('savedDrawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

function renderSavedList() {
  const list = document.getElementById('savedList');
  if (savedRecipes.length === 0) {
    list.innerHTML = '<p class="empty-saved">No saved recipes yet.<br>Click 🔖 Save after generating one!</p>';
    return;
  }
  list.innerHTML = '';
  savedRecipes.forEach((entry, i) => {
    const item = document.createElement('div');
    item.className = 'saved-item';
    const date = new Date(entry.savedAt).toLocaleDateString();
    item.innerHTML = `
      <div class="saved-item-name">${escapeHtml(entry.recipe.dishName)}</div>
      <div class="saved-item-meta">${entry.ing1}, ${entry.ing2}, ${entry.ing3} · ${date}</div>`;
    item.addEventListener('click', () => {
      currentRecipe = entry;
      servings = entry.servings;
      document.getElementById('servingVal').textContent = servings;
      renderRecipe(entry.recipe, entry.diets || [], entry.cuisine || null);
      document.getElementById('result').style.display = 'block';
      closeDrawer();
      setTimeout(() => document.getElementById('result').scrollIntoView({ behavior: 'smooth' }), 100);
    });
    list.appendChild(item);
  });
}

document.getElementById('clearSavedBtn').addEventListener('click', () => {
  if (!confirm('Clear all saved recipes?')) return;
  savedRecipes = [];
  localStorage.setItem('fridgeHeroSaved', JSON.stringify(savedRecipes));
  updateSavedCount();
  renderSavedList();
});

function updateSavedCount() {
  document.getElementById('savedCount').textContent = savedRecipes.length;
}

// ── Helpers ──
function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.style.display = 'block';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
