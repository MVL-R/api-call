const apiUrl = 'https://mhw-db.com/monsters';
let currentPage = 1;
let monsterIds = [];

async function loadMonsterIds() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const monsters = await response.json();
        monsterIds = monsters.map(monster => monster.id);
        fetchMonster();
    } catch (error) {
        console.error('Error fetching monster IDs:', error);
        displayError('Failed to load monster data. Please try again later.');
    }
}

document.getElementById('next').addEventListener('click', () => {
    if (currentPage < monsterIds.length) {
        currentPage++;
        fetchMonster();
    }
});

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMonster();
    }
});

async function fetchMonster() {
    try {
        const monsterId = monsterIds[currentPage - 1];
        const response = await fetch(`${apiUrl}/${monsterId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const monster = await response.json();
        displayMonster(monster);

        document.getElementById('prev').disabled = currentPage === 1;
        document.getElementById('next').disabled = currentPage === monsterIds.length;
    } catch (error) {
        console.error('Error fetching data:', error);
        displayError('Failed to load monster data. Please try again later.');
    }
}

function displayMonster(monster) {
    const display = document.getElementById('monster-display');

    const drops = monster.rewards ? 
        monster.rewards.map(reward => {
            const conditions = reward.conditions.map(cond => {
                if (typeof cond === 'object' && cond !== null) {
                    return cond.name || JSON.stringify(cond);
                }
                return cond;
            }).join(', ');

            return `<li>${reward.item.name} (Condition: ${conditions || 'Unknown'})</li>`;
        }).join('') : 
        '<li>No related items available</li>';

    display.innerHTML = `
        <div class="bg-gray-900 rounded-lg shadow-md p-6">
            <div class="flex flex-col">
                <h2 class="text-4xl font-bold mb-4 text-white">${monster.name}</h2>
                <p class="text-white mb-6">${monster.description || 'Description not available.'}</p>
                <div class="space-y-4 text-white">
                    <p><strong>Type:</strong> ${monster.type || 'Unknown'}</p>
                    <p><strong>Species:</strong> ${monster.species || 'Unknown'}</p>
                    <h3 class="text-xl font-semibold mt-4">Weaknesses</h3>
                    <ul class="list-disc list-inside">
                        ${monster.weaknesses ? monster.weaknesses.map(w => `<li>${w.element} (Weakness: ${w.stars} stars)</li>`).join('') : '<li>Not available</li>'}
                    </ul>
                    <h3 class="text-xl font-semibold mt-4">Recovery and Related Items</h3>
                    <ul class="list-disc list-inside">
                        ${drops}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

loadMonsterIds();