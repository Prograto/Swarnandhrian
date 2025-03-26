const Course_Competitor__url = 'https://script.google.com/macros/s/AKfycbx5j_rpU0w9piTyyzuBqiGZ810AlO_A2atPtuweZ-02diokmqzhV13f_o2slLlM_rdF/exec'; 

fetch(Course_Competitor__url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        updateCoding(data);
    })
    .catch(error => console.error('Error fetching the sheet:', error));

function updateCoding(Concepts) {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    // Ensure student_id is fetched from the window object
    const student_id = window.studentId; 

    Concepts.forEach(sheetData => {
            console.log(sheetData);
            // Create a card for each sheet to display the Main_Img_Url
            const card = document.createElement('div');
            card.className = 'l_card';
            card.setAttribute('data-sheet-name', sheetData.sheetName);

            const ConceptHeading = document.createElement('h2');
            ConceptHeading.textContent = sheetData.sheetName;

            const ConceptImage = document.createElement('img');
            ConceptImage.classList.add('course-img');

            const conceptp = document.createElement('p');


            conceptp.textContent = sheetData.topicCount + " Topics";
            ConceptImage.src = sheetData.mainImgUrl;  
           
            card.appendChild(ConceptHeading);
            card.appendChild(ConceptImage);
            card.appendChild(conceptp);

            card.addEventListener('click', function () {
                const code_concepts = this.getAttribute('data-sheet-name'); 
                window.location.href = `/code_concepts/${code_concepts}`; 
            });
            
            container.appendChild(card);
        }
    );
        
}
