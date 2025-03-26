const Course_Competitor__url = 'https://script.google.com/macros/s/AKfycbx3BNx6CgJMRtCaWKXN1t-1oH__-k-KO45TEZg4ZAP71_lRxqol3LB5jV-H6cPd1oz0CQ/exec'; 

fetch(Course_Competitor__url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        updateLogical(data);
    })
    .catch(error => console.error('Error fetching the sheet:', error));

function updateLogical(courses) {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    // Ensure student_id is fetched from the window object
    const student_id = window.studentId; 

    // Loop through each sheet's data
    for (const [sheetName, sheetData] of Object.entries(courses)) {
        if (sheetData.length > 0) {
            console.log(sheetData);
            // Create a card for each sheet to display the Main_Img_Url
            const card = document.createElement('div');
            card.className = 'l_card';
            card.setAttribute('data-sheet-name', sheetName);

            const courseHeading = document.createElement('h2');
            courseHeading.textContent = sheetName;

            const courseImage = document.createElement('img');
            courseImage.classList.add('course-img');

            const coursep = document.createElement('p');
            let arr = [];
            sheetData.forEach(element => {
                if (!arr.includes(element.Concept)) {
                    arr.push(element.Concept);
                }
            });
            console.log(arr);

            coursep.textContent = arr.length + " Topics";
            courseImage.src = sheetData[0].Main_Img_Url;  // Assuming the Main_Img_Url is the same for all rows in a sheet
           
            card.appendChild(courseHeading);
            card.appendChild(courseImage);
            card.appendChild(coursep);

            card.addEventListener('click', function () {
                const course_concepts = this.getAttribute('data-sheet-name'); 
                window.location.href = `/course_concepts/${course_concepts}`; 
            });
            
            container.appendChild(card);
        }
    }
}
