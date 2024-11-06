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