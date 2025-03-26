console.log(course_concepts + " from js");

const Course_Competitor__url = 'https://script.google.com/macros/s/AKfycbx3BNx6CgJMRtCaWKXN1t-1oH__-k-KO45TEZg4ZAP71_lRxqol3LB5jV-H6cPd1oz0CQ/exec'; 

fetch(Course_Competitor__url)
    .then(response => response.json())
    .then(data => {
        console.log(data[course_concepts]);  
        updateLogical(data);  
    })
    .catch(error => console.error('Error fetching the sheet:', error));

function updateLogical(courses) {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    var course = courses[course_concepts];
    var arr = [];
    
    // Check if 'logical' is defined before processing
    if (course) {
        course.forEach(element => {
            if (!arr.some(item => item[0] === element.Concept && item[1] === element.Concept_Url)) {
                arr.push([element.Concept, element.Concept_Url]);
            }
        });
    
        // Loop through each concept to create a card for each one
        arr.forEach(concept => {
            const card = document.createElement('div');
            card.className = 'l_card';
            card.setAttribute('data-sheet-name', concept[0]);

            const courseHeading = document.createElement('h2');
            courseHeading.textContent = concept[0];

            const courseImage = document.createElement('img');
            courseImage.classList.add('course-img');
            courseImage.src = concept[1];

            card.appendChild(courseHeading);
            card.appendChild(courseImage);

            student_id = window.studentId;


            card.addEventListener('click', function () {
                const course_topics = this.getAttribute('data-sheet-name'); 
                window.location.href = `/courses/${course_concepts}/${course_topics}`; 
            });

            container.appendChild(card);
        });
    } else {
        console.error('The specified logical concept does not exist in the data.');
    }
}
