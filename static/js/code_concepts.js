// JavaScript to send the sheet name and fetch the topics from the Apps Script
async function fetchTopics(sheetName) {
    const url = 'https://script.google.com/macros/s/AKfycbwYGCWUGnALSym0Xy9WSOkLtH62EPigy1jtgW9CLt5l0KF1xtV6_aMgx_D_H1yX3Kw/exec'; // Replace with your Apps Script URL
  
    const formData = new URLSearchParams();
    formData.append('sheet_name', sheetName);
  
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
  
    const topics = await response.json();
  
    if (topics.error) {
      console.error(topics.error);
      return;
    }
  
    console.log(topics); // Now you have the topics data and can display it in your webpage
    
    updateConcepts(topics);
  }
function updateConcepts(topics){
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    // Loop through each concept to create a card for each one
    topics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'l_card';
        card.setAttribute('data-sheet-name', topic.topic);

        const conceptHeading = document.createElement('h2');
        conceptHeading.textContent = topic.topic;

        const conceptImage = document.createElement('img');
        conceptImage.classList.add('course-img');
        conceptImage.src = topic.url;

        const conceptP = document.createElement('p')
        conceptP.textContent = `${topic.questionsCount} questions`

        card.appendChild(conceptHeading);
        card.appendChild(conceptImage);
        card.appendChild(conceptP);

        student_id = window.studentId;

        code_concepts = window.code_concepts

        card.addEventListener('click', function () {
            const code_topics = this.getAttribute('data-sheet-name'); 
            window.location.href = `/code_topic/${code_concepts}/${code_topics}`; 
        });

        container.appendChild(card);
    });
}
  
  // Call the function to fetch topics from the specified sheet name
  fetchTopics(window.code_concepts);
  