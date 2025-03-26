let topicsData = []; 
let currentPage = 1; 
const itemsPerPage = 5; 

// Fetch topics and store them in global variable
async function fetchTopics(sheetName, topic) {
    const url = 'https://script.google.com/macros/s/AKfycbwb1ueZGdjNSYxfaDmpGlDgKj_KCYzrL8fRBTTNj5spY8pd4wTEnVTSXQDhaRgV6cnE/exec'; // Replace with your Apps Script URL
    const formData = new URLSearchParams();
    formData.append('sheet_name', sheetName);
    formData.append('topic', topic);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const topics = await response.json();

        if (topics.error) {
            console.error(topics.error);
            return;
        }

        topicsData = topics;
        currentPage = 1; // Reset currentPage when new data is fetched
        updateConcepts(); // Call to update DOM with first page of topics
        renderPagination(); // Call to render pagination buttons
    } catch (error) {
        console.error('Error fetching topics:', error);
    }
}

// Function to update the DOM with topics (with pagination and filter)
function updateConcepts(filteredTopics = topicsData) {
    console.log(filteredTopics);
    const cardContainer = document.getElementById('card-container');
    
    if (!cardContainer) {
        console.error('Card container not found!');
        return;
    }

    // Clear the container
    cardContainer.innerHTML = '';

    // Calculate start and end indices for pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTopics = filteredTopics.slice(startIndex, endIndex);

    // Generate the card elements for each topic
    paginatedTopics.forEach(topic => {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        
        const img = document.createElement('img');
        img.src = '/static/images/computer.png';
        img.alt = topic.problemTitle;
        img.classList.add('problem-image');
        
        cardHeader.appendChild(img);
        card.appendChild(cardHeader);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h2');
        title.textContent = topic.problemTitle;

        cardBody.appendChild(title);
        card.appendChild(cardBody);

        const cardFooter = document.createElement('div');
        cardFooter.classList.add('card-footer');

        const difficulty = document.createElement('span');
        difficulty.classList.add('difficulty', topic.level.toLowerCase());
        difficulty.textContent = topic.level;

        const points = document.createElement('span');
        points.classList.add('points');
        points.textContent = `${topic.points} Points`;

        const solve = document.createElement('button');
        solve.classList.add('button');
        solve.textContent = "Solve";
        let studentId = window.studentId;
        // Add event listener to the "Solve" button
        solve.addEventListener('click', function() {
            localStorage.setItem('selectedTopic', JSON.stringify(topic));
            window.location.href = `/coding_page/${encodeURIComponent(topic.problemTitle)}`;
        });

        cardFooter.appendChild(difficulty);
        cardFooter.appendChild(points);
        card.appendChild(cardFooter);

        card.append(solve);
        cardContainer.appendChild(card);
    });
}

// Function to render pagination buttons
function renderPagination(filteredTopics = topicsData) {
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer) {
        console.error('Pagination container not found!');
        return;
    }

    paginationContainer.innerHTML = ''; // Clear the pagination buttons

    const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('pagination-btn');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', function() {
            currentPage = i; // Set currentPage to the button's page number
            updateConcepts(filteredTopics); // Update concepts based on new page
            renderPagination(filteredTopics); // Re-render pagination
        });
        paginationContainer.appendChild(button);
    }
}

// Function to handle filtering by difficulty
function filterByDifficulty(level) {
    const filteredTopics = topicsData.filter(topic => topic.level.toLowerCase() === level.toLowerCase());
    currentPage = 1; // Reset to page 1 when filter is applied
    updateConcepts(filteredTopics);
    renderPagination(filteredTopics);
}
  // Call the function to fetch topics from the specified sheet name
fetchTopics(window.code_concept,window.code_topics);
  