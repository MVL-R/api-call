const weaponsApiUrl = 'https://mhw-db.com/weapons';
let weaponIds = [];

async function loadWeaponIds() {
    try {
        const response = await fetch(weaponsApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const weapons = await response.json();
        weaponIds = weapons.map(weapon => weapon.id);
        fetchWeapon();
    } catch (error) {
        console.error('Error fetching weapon IDs:', error);
        displayError('Failed to load weapon data. Please try again later.');
    }
}

document.getElementById('next').addEventListener('click', () => {
    if (weaponIds.length > 0) {
        fetchWeapon();
    }
});

async function fetchWeapon() {
    try {
        const randomIndex = Math.floor(Math.random() * weaponIds.length);
        const weaponId = weaponIds[randomIndex];

        const response = await fetch(`${weaponsApiUrl}/${weaponId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const weapon = await response.json();
        displayWeapon(weapon);
    } catch (error) {
        console.error('Error fetching weapon data:', error);
        displayError('Failed to load weapon data. Please try again later.');
    }
}

function displayWeapon(weapon) {
    const display = document.getElementById('weapon-display');

    const durabilityHtml = weapon.durability ? 
        weapon.durability.map((d, index) => `
            <li>
                Sharpness ${index + 1}: 
                Red: ${d.red}, Orange: ${d.orange}, Yellow: ${d.yellow}, 
                Green: ${d.green}, Blue: ${d.blue}, White: ${d.white || 0}
            </li>
        `).join('') : 
        '<li>No durability data available</li>';

        display.innerHTML = `
        <div class="bg-gray-900 rounded-lg shadow-md p-6 flex flex-wrap max-w-full">
            <div class="w-full md:w-1/3">
                <img src="${weapon.assets?.image || 'default-image-url.jpg'}" alt="${weapon.name}" class="w-full h-auto rounded mb-4">
            </div>
            <div class="w-full md:w-2/3 pl-6 text-white">
                <h2 class="text-4xl font-bold mb-4">${weapon.name}</h2>
                <p><strong>Type:</strong> ${weapon.type || 'Unknown'}</p>
                <p><strong>Rarity:</strong> ${weapon.rarity || 'Unknown'}</p>
                <p><strong>Attack:</strong> ${weapon.attack?.display || 'Unknown'}</p>
                <p><strong>Elderseal:</strong> ${weapon.attributes?.elderseal || 'N/A'}</p>
                <p><strong>Damage Type:</strong> ${weapon.damageType || 'Unknown'}</p>
                <p><strong>Slots:</strong> ${weapon.slots?.map(slot => `Level ${slot.rank}`).join(', ') || 'None'}</p>
                <p><strong>Element:</strong> ${weapon.elements?.map(el => `${el.type} (${el.damage} dmg, hidden: ${el.hidden})`).join(', ') || 'None'}</p>
                <h3 class="text-xl font-semibold mt-4">Durability</h3>
                <ul class="list-disc list-inside mb-4">
                    ${durabilityHtml}
                </ul>
                <h3 class="text-xl font-semibold mt-4">Upgrade Materials</h3>
                <ul class="list-disc list-inside">
                    ${weapon.crafting?.upgradeMaterials ? 
                        weapon.crafting.upgradeMaterials.map(mat => `<li>${mat.item.name} x${mat.quantity}</li>`).join('') : 
                        '<li>No upgrade materials available</li>'}
                </ul>
            </div>
        </div>
    `;
    
}

loadWeaponIds();
