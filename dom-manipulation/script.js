const { createElement } = require("react");

// Initial quotes array
let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

function restoreLastFilter() {
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.value = lastCategory;
    filterQuotes();
  }
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

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
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

  quotes.push({ text: newText, category: newCategory });
  saveQuotes();

  // Update dropdown if category is new
  const categoryFilter = document.getElementById("categoryFilter");
  const existingOptions = Array.from(categoryFilter.options).map(opt => opt.value);
  if (!existingOptions.includes(newCategory)) {
    const newOption = document.createElement("option");
    newOption.value = newCategory;
    newOption.textContent = newCategory;
    categoryFilter.appendChild(newOption);
  }

  // Optional: auto-select new category
  categoryFilter.value = newCategory;
  localStorage.setItem("lastCategory", newCategory);
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";
  alert("Quote added successfully!");
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Load quotes from localStorage on page load
loadQuotes();
showRandomQuote();




  

// Create the form dynamically (optional enhancement)
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

function exportToJsonFile() {
  
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "quotes.json";
  downloadLink.click();

  URL.revokeObjectURL(url); // Clean up
}

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
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid file format.");
            }
        } catch (error) {
            alert("Error reading file: " + error.message);
        }
    };

    reader.readAsText(file);
}

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><small>— ${quote.category}</small>`;
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

const exportBtn = document.getElementById("exportQuotesBtn");
if (exportBtn) exportBtn.addEventListener("click", exportToJsonFile);

const importInput = document.getElementById("importQuotesInput");
if (importInput) importInput.addEventListener("change", importFromJsonFile);

// Optional: auto-create the form on load
loadQuotes();
populateCategories();
restoreLastFilter();
showRandomQuote();  
createAddQuoteForm();
createImportExportButtons();
createAddQuoteForm();

