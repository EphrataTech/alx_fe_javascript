let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
}

// Restore last selected category
function restoreLastFilter() {
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.value = lastCategory;
    filterQuotes();
  }
}

// Filter quotes by category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
}

// Populate category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote text and category.");
    return;
  }

  const newQuote = { text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();
  postQuoteToServer(newQuote);

  const categoryFilter = document.getElementById("categoryFilter");
  const existingOptions = Array.from(categoryFilter.options).map(opt => opt.value);
  if (!existingOptions.includes(newCategory)) {
    const newOption = document.createElement("option");
    newOption.value = newCategory;
    newOption.textContent = newCategory;
    categoryFilter.appendChild(newOption);
  }

  categoryFilter.value = newCategory;
  localStorage.setItem("lastCategory", newCategory);
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

// POST quote to server using async/await
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Quote posted:", result);
    notifyUser("Quote synced to server.");
  } catch (error) {
    console.error("POST failed:", error);
  }
}

// Export quotes to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        notifyUser("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid file format.");
      }
    } catch (error) {
      alert("Error reading file: " + error.message);
    }
  };
  reader.readAsText(file);
}

// Fetch quotes from server using async/await
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    const formattedQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));
    syncQuotes(formattedQuotes);
  } catch (error) {
    console.error("Server fetch failed:", error);
  }
}

// Merge server quotes
function syncQuotes(serverQuotes) {
  let updated = false;
  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote =>
      localQuote.text === serverQuote.text &&
      localQuote.category === serverQuote.category
    );
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

 if (updated) {
  saveQuotes();
  populateCategories();
  notifyUser("Quotes synced with server!");
  showRandomQuote();
}

}

// Notification UI
function notifyUser(message) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #333;
    color: white;
    padding: 10px;
    border-radius: 5px;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

// Create quote form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.body.appendChild(formContainer);
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

// Create import/export UI
function createImportExportButtons() {
  const container = document.createElement("div");
  container.innerHTML = `
    <button id="exportQuotesBtn">Export Quotes</button>
    <input type="file" id="importQuotesInput" accept=".json" />
  `;
  document.body.appendChild(container);
  document.getElementById("exportQuotesBtn").addEventListener("click", exportToJsonFile);
  document.getElementById("importQuotesInput").addEventListener("change", importFromJsonFile);
}

// Initialization
loadQuotes();
populateCategories();
restoreLastFilter();
showRandomQuote();
createAddQuoteForm();
createImportExportButtons();
setInterval(fetchQuotesFromServer, 30000);
newQuoteBtn.addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
