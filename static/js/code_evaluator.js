let studentId = window.studentId;
let data = JSON.parse(localStorage.getItem('selectedTopic'));
console.log("Data:",data)
let points = document.getElementById("points");
points.textContent = `${data.points} points`;
points.classList.add("fan-font");
let h = document.getElementById("statement")
h.textContent = data.problemTitle;
let psdata = document.getElementById('psdata');
psdata.textContent = data.problemStatement;
let ndata = document.getElementById('ndata');
ndata.textContent = data.notes;
let indata = document.getElementById('indata');
indata.textContent = data.input;
let outdata = document.getElementById('outdata');
outdata.textContent = data.output;
let in1data = document.getElementById('in1data');
in1data.textContent = data.sampleInputs[0];
let out1data = document.getElementById('out1data');
out1data.textContent = data.sampleOutputs[0];
let in2data = document.getElementById('in2data');
in2data.textContent = data.sampleInputs[1];
let out2data = document.getElementById('out2data');
out2data.textContent = data.sampleOutputs[1];
const outputDiv = document.getElementById("output");
const output_section = document.getElementById("output-section");
outputDiv.textContent = 'Result...!';  


async function executeCode() {
    const code = document.getElementById('codeInput').value;
    const inputs = [in1data.textContent, in2data.textContent];  
    const expectedOutputs = [out1data.textContent, out2data.textContent];  
    const language = document.getElementById('codeLanguage').value;
    outputDiv.textContent = 'Executing...';  

    output_section.innerHTML = ''; 
    console.log(`inputs length ${inputs.length}`);
    
    // Loop through inputs and expected outputs
    for (let i = 0; i < inputs.length; i++) {
        try {
            const response = await fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    language,
                    inputs: inputs[i],  
                    expectedOutput: expectedOutputs[i] 
                })
            });

            const result = await response.json();

            var testcasecard = document.createElement('div');
            var testcasetext = document.createElement('p');
            testcasetext.textContent = `Test case ${i + 1}: ${result.output}`;
            testcasecard.classList.add("card");
            testcasecard.style.backgroundColor = "#e84944f6";
            
            outputDiv.textContent = 'Public testcases failed!';
            outputDiv.style.color = '#e84944f6';

            if (result.output === "Correct Output!") {
                testcasecard.style.backgroundColor = "#1ec66c";
                outputDiv.textContent = 'Public testcases passed!'; 
                outputDiv.style.color = '#1ec66c';
            } 

            testcasecard.appendChild(testcasetext);

            output_section.appendChild(testcasecard);

            console.log(`Test case ${i + 1}: ${result.output}`);
        } catch (error) {
            var testcasecard = document.createElement('div');
            var testcasetext = document.createElement('p');
            testcasetext.textContent = `Error in test case ${i + 1}: ${error.message}`;
            testcasecard.classList.add("card");
            testcasecard.style.backgroundColor = "#e84944f6";

            testcasecard.appendChild(testcasetext);

            output_section.appendChild(testcasecard);
            outputDiv.textContent = 'Done!';
        }
    }

    console.log('Total inputs:', inputs.length);
}


async function submitCode() {
    const code = document.getElementById('codeInput').value;
    const inputs = data.sampleInputs;  
    const expectedOutputs = data.sampleOutputs; 
    const language = document.getElementById('codeLanguage').value;
    const totalTestCases = inputs.length;
    let passedTestCases = 0;

    outputDiv.textContent = 'Executing...';  
    output_section.innerHTML = ''; 

    const testCaseResults = [];

    for (let i = 0; i < totalTestCases; i++) {
        try {
            const response = await fetch('/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code,
                    language,
                    inputs: inputs[i],  
                    expectedOutput: expectedOutputs[i]
                })
            });

            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                const result = await response.json();
                const isCorrect = result.output === "Correct Output!";
                
                const testcasecard = document.createElement('div');
                const testcasetext = document.createElement('p');
                testcasetext.textContent = `Test case ${i + 1}: ${isCorrect ? 'Success' : 'Failed'} - ${result.output}`;
                
                testcasecard.classList.add("card");
                testcasecard.style.backgroundColor = isCorrect ? "#1ec66c" : "#e84944f6";
                testcasecard.appendChild(testcasetext);
                output_section.appendChild(testcasecard);

                testCaseResults.push({ testCase: i + 1, result: isCorrect ? 'Success' : 'Failed' });

                if (isCorrect) passedTestCases++;
            } else {
                throw new Error('Server returned a non-JSON response.');
            }

        } catch (error) {
            const testcasecard = document.createElement('div');
            const testcasetext = document.createElement('p');
            testcasetext.textContent = `Error in test case ${i + 1}: ${error.message}`;
            testcasecard.classList.add("card");
            testcasecard.style.backgroundColor = "#e84944f6";
            testcasecard.appendChild(testcasetext);
            output_section.appendChild(testcasecard);

            testCaseResults.push({ testCase: i + 1, result: 'Error' });
        }
    }

    // Update outputDiv based on test case results
    if (passedTestCases === totalTestCases) {
        outputDiv.textContent = 'All test cases passed!';
        outputDiv.style.color = '#1ec66c';
    } else {
        outputDiv.textContent = `${passedTestCases}/${totalTestCases} test cases passed.`;
        outputDiv.style.color = '#e84944f6';
    }

    console.log('Test case results:', testCaseResults);

    // Calculate score
    const scorePerTestCase = data.points / totalTestCases;
    const totalScore = passedTestCases * scorePerTestCase;

    // Send data
    sendData(
        studentId,
        data.problemStatement,
        testCaseResults,
        totalScore
    );
}

function sendData(regNo, problemStatement, testCaseResults, totalScore) {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbyh3Rg3sbz1ztOcM9_7Q0VTBD53SXHtRuSdJDW_SnZBomzF-o-9iZtkF7-A06poCOiS/exec';

    const payload = {
        regNo,
        problemStatement,
        testCaseResults,
        totalScore
    };    

    $.post(scriptUrl, JSON.stringify(payload), function(response) {
        console.log('Response from server: ' + response);
      }).fail(function(xhr, status, error) {
        console.error('Error:', error);
      });
}
