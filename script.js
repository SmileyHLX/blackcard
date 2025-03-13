document.addEventListener("DOMContentLoaded", fetchRandomCell);

let usedPrompts = []; // Keeps track of prompts already used
let allPrompts = [];  // All prompts fetched
let filteredPrompts = [];  // Filtered prompts after removing AI ones
let totalPrompts = 0; // Total non-AI prompts

async function fetchRandomCell() {
    const sheetUrl = "https://docs.google.com/spreadsheets/d/15BWR2T8ggLe3hf80rSKa2v3DLXh0Z_5p/gviz/tq?tqx=out:json&gid=2065766925";
    
    try {
        // Fetch the data from Google Sheets
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.match(/\{.*\}/s)[0]);

        // Get all prompts
        allPrompts = json.table.rows.map(row => row.c[0]?.v).filter(Boolean);

        // Get the setting for hiding AI prompts
        const hideAI = localStorage.getItem("hideAIPrompts") === "true";

        // Filter prompts based on AI setting
        filteredPrompts = hideAI ? allPrompts.filter(prompt => !prompt.startsWith("(AI)")) : allPrompts;

        totalPrompts = filteredPrompts.length;

        // If no prompts are available
        if (totalPrompts === 0) {
            updateCard("No prompts available", "0/0");
            return;
        }

        // Filter out used prompts
        const remainingPrompts = filteredPrompts.filter(prompt => !usedPrompts.includes(prompt));

        // If there are no remaining prompts, reset used prompts
        if (remainingPrompts.length === 0) {
            usedPrompts = [];
        }

        // Choose a random prompt from the remaining ones
        const randomText = remainingPrompts[Math.floor(Math.random() * remainingPrompts.length)];
        usedPrompts.push(randomText); // Add it to the used list

        // Update the card and the counter
        updateCard(randomText || "No Data", `${usedPrompts.length}/${totalPrompts}`);

    } catch (error) {
        console.error("Error fetching data:", error);
        updateCard("Error Loading", "0/0");
    }
}

// Updates the card with new prompt and counter
function updateCard(text, counter) {
    document.getElementById("cardText").innerText = text;
    document.getElementById("counter").innerText = counter;
}

function openSettings() {
    window.location.href = "settings.html"; // Redirect to settings page
}
