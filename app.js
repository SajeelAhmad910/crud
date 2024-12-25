const baseUrl = 'http://localhost:5000/api/items';

// Utility to create an HTML element
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  Object.keys(options).forEach((key) => {
    if (key === 'className') {
      element.className = options[key];
    } else {
      element[key] = options[key];
    }
  });
  return element;
}

// Fetch and display items
async function fetchItems() {
  try {
    const response = await fetch(baseUrl);
    const items = await response.json();
    const itemsList = document.getElementById('itemsList');
    itemsList.innerHTML = '';

    items.forEach((item) => {
      const itemDiv = createElement('div', { className: 'item' });
      const itemName = createElement('p', { innerText: item.name });
      const actionsDiv = createElement('div', { className: 'actions' });

      const deleteBtn = createElement('button', {
        innerText: 'Delete',
        onclick: () => deleteItem(item._id),
      });

      const updateBtn = createElement('button', {
        innerText: 'Update',
        onclick: () => updateItem(item._id),
      });

      actionsDiv.appendChild(updateBtn);
      actionsDiv.appendChild(deleteBtn);
      itemDiv.appendChild(itemName);
      itemDiv.appendChild(actionsDiv);
      itemsList.appendChild(itemDiv);
    });
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

// Add new item
document.getElementById('addItemForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('itemName').value;

  try {
    await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    document.getElementById('itemName').value = '';
    fetchItems();
  } catch (error) {
    console.error('Error adding item:', error);
  }
});

// Delete an item
async function deleteItem(id) {
  try {
    await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    fetchItems();
  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// Update an item
async function updateItem(id) {
  const newName = prompt('Enter new name:');
  if (newName) {
    try {
      await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }
}

// Initial data load
fetchItems();
