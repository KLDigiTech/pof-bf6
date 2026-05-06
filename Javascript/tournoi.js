// ============================================
// WARSTACK — Classement Live
// Fetch Supabase toutes les 60 secondes
// ============================================

const SUPABASE_URL = 'https://eaiuibqpouwwkqdcwthl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaXVpYnFwb3V3d2txZGN3dGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODkyNzMsImV4cCI6MjA5MzY2NTI3M30.QHjd47M2ODKkYLvkCed5Ay4a5bPxxoBsk2aXeWlNk6M';

async function fetchClassement() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/players?select=*&order=kd.desc`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const players = await response.json();
    renderClassement(players);

  } catch (error) {
    document.getElementById('leaderboard-body').innerHTML =
      '<div class="no-players">❌ Erreur de chargement</div>';
  }
}

function renderClassement(players) {
  const body = document.getElementById('leaderboard-body');

  if (!players || players.length === 0) {
    body.innerHTML = `
      <div class="no-players">
        Aucun joueur inscrit.<br>
        <small style="color:#555">Utilise /link sur Discord !</small>
      </div>
    `;
    return;
  }

  document.getElementById('total-players').textContent = players.length;
  document.getElementById('total-kills').textContent =
    players.reduce((sum, p) => sum + (p.kills || 0), 0).toLocaleString();
  document.getElementById('best-kd').textContent =
    (players[0].kd || 0).toFixed(2);

  const ranks = ['🥇', '🥈', '🥉'];
  const rankClasses = ['gold', 'silver', 'bronze'];

  body.innerHTML = players.map((p, i) => `
    <div class="leaderboard-row">
      <div class="rank ${rankClasses[i] || ''}">${ranks[i] || `#${i + 1}`}</div>
      <div>
        <span class="player-name">${p.pseudo_bf6}</span>
        <span class="platform-badge">${p.platform?.toUpperCase()}</span>
      </div>
      <div class="stat kd">${(p.kd || 0).toFixed(2)}</div>
      <div class="stat">${p.kills || 0}</div>
      <div class="stat col-wins">${p.wins || 0}</div>
    </div>
  `).join('');
}

fetchClassement();
setInterval(fetchClassement, 60000);