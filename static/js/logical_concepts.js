console.log(logical_concepts + " from js");

const Locical_Competitor__url = 'https://script.google.com/macros/s/AKfycbw9QmMhqUncwoyzmGddeQ8k89eN1SgfOEgsA3IKcNiArO26Yaa48xiq9R82asV3L7R70g/exec'; 

fetch(Locical_Competitor__url)
    .then(response => response.json())
    .then(data => {
        console.log(data[logical_concepts]);  
        updateLogical(data);  
    })
    .catch(error => console.error('Error fetching the sheet:', error));

function updateLogical(logicals) {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    var logical = logicals[logical_concepts];
    var arr = [];
    
    // Check if 'logical' is defined before processing
    if (logical) {
        logical.forEach(element => {
            if (!arr.some(item => item[0] === element.Concept && item[1] === element.Concept_Url)) {
                arr.push([element.Concept, element.Concept_Url]);
            }
        });
    
        // Loop through each concept to create a card for each one
        arr.forEach(concept => {
            const card = document.createElement('div');
            card.className = 'l_card';
            card.setAttribute('data-sheet-name', concept[0]);

            const LogicHeading = document.createElement('h2');
            LogicHeading.textContent = concept[0];

            const logicImage = document.createElement('img');
            logicImage.classList.add('course-img');
            logicImage.src = concept[1];

            card.appendChild(LogicHeading);
            card.appendChild(logicImage);

            student_id = window.studentId;


            card.addEventListener('click', function () {
                const logical_topics = this.getAttribute('data-sheet-name'); 
                window.location.href = `/${logical_concepts}/${logical_topics}`; 
            });

            container.appendChild(card);
        });
    } else {
        console.error('The specified logical concept does not exist in the data.');
    }
}
