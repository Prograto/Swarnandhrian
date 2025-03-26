const Locical_Competitor__url = 'https://script.google.com/macros/s/AKfycbw9QmMhqUncwoyzmGddeQ8k89eN1SgfOEgsA3IKcNiArO26Yaa48xiq9R82asV3L7R70g/exec'; 

fetch(Locical_Competitor__url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        updateLogical(data);
    })
    .catch(error => console.error('Error fetching the sheet:', error));

function updateLogical(logicals) {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';

    // Ensure student_id is fetched from the window object
    const student_id = window.studentId; 

    // Loop through each sheet's data
    for (const [sheetName, sheetData] of Object.entries(logicals)) {
        if (sheetData.length > 0) {
            console.log(sheetData);
            // Create a card for each sheet to display the Main_Img_Url
            const card = document.createElement('div');
            card.className = 'l_card';
            card.setAttribute('data-sheet-name', sheetName);

            const LogicHeading = document.createElement('h2');
            LogicHeading.textContent = sheetName;

            const logicImage = document.createElement('img');
            logicImage.classList.add('course-img');

            const logicp = document.createElement('p');
            let arr = [];
            sheetData.forEach(element => {
                if (!arr.includes(element.Concept)) {
                    arr.push(element.Concept);
                }
            });
            console.log(arr);

            logicp.textContent = arr.length + " Topics";
            logicImage.src = sheetData[0].Main_Img_Url;  // Assuming the Main_Img_Url is the same for all rows in a sheet
           
            card.appendChild(LogicHeading);
            card.appendChild(logicImage);
            card.appendChild(logicp);

            card.addEventListener('click', function () {
                const logical_concepts = this.getAttribute('data-sheet-name'); 
                window.location.href = `/logical_concepts/${logical_concepts}`; 
            });
            
            container.appendChild(card);
        }
    }
}
