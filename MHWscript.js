const apiUrl = 'https://mhw-db.com/monsters';
let currentPage = 1;
const pageSize = 1;

document.getElementById('next').addEventListener('click', () => {
    currentPage++;
    fetchMonster();
  });
  
  document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchMonster();
    }
  });

  async function fetchMonster() {
    try {
      const response = await fetch(`${apiUrl}?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`, { timeout: 5000 });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const [monster] = await response.json();
      displayMonster(monster);
  
      document.getElementById('prev').disabled = currentPage === 1;
    } catch (error) {
      console.error('Error fetching data:', error);
      displayError(error.message);
    }
  }

  function displayMonster(monster) {
    const display = document.getElementById('monster-display');
    const weaponWeaknesses = weaponWeaknesses[monster.name] || null;
  
    display.innerHTML = `
      <div class="bg-gray-800 rounded-lg shadow-md p-6">
        <div class="flex flex-col">
          <h2 class="text-4xl font-bold mb-4" text-white>${monster.name}</h2>
          <p class="text-gray-300 mb-6">${monster.description || 'Description not available.'}</p>
          <div class="space-y-4">
            <p><strong>Type:</strong> ${monster.type || 'Unknown'}</p>
            <p><strong>Species:</strong> ${monster.species || 'Unknown'}</p>
            <h3 class="text-xl font-semibold mt-4">Weaknesses</h3>
            <ul class="list-disc list-inside text-gray-300">
              ${monster.weaknesses ? monster.weaknesses.map(w => `<li>${w.element} (Weakness: ${w.stars} stars)</li>`).join('') : '<li>Not available</li>'}
            </ul>

            ${weaponWeaknesses ? `
              <h3 class="text-xl font-semibold mt-4">Weapon Type Weaknesses</h3>
              <ul class="list-disc list-inside text-gray-300">
                ${Object.entries(weaponWeaknesses).map(([weapon, level]) => `<li>${weapon}: ${level}</li>`).join('')}
              </ul>
              ` : ''}
          </div>
        </div>
      </div>
    `;
  }