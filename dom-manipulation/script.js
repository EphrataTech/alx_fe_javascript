const { get } = require("http");

let quotes = [
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { text: "Simplicity is the soul of efficiency.", category: "Design" },
  { text: "Before software can be reusable it first has to be usable.", category: "Engineering" }
];

const quoteText = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

function getRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}


function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    const quoteInput  =document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter quote text';

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Quote';
    addBtn.onclick = addQuote;

    formContainer.appendChild(quoteInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addBtn);

    document.body.appendChild(formContainer);

}

    function addQuote() {
        const quoteText = document.getElementById('newQuoteText').value.trim();
        const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (!quoteText || !quoteCategory) {
            alert('Please enter both quote text and category.');
            return;
        }

        quotes.push({ text: quoteText, category: quoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        getRandomQuote();
    }

    newQuoteBtn.addEventListener('click', getRandomQuote);
    createAddQuoteForm();
    getRandomQuote();