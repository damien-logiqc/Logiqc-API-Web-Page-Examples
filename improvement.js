const baseUrl = "https://1a8aec84-215e-43fb-a052-fff56d0599a7.mock.pstmn.io/api/";
const baseHdr = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbklkIjoiN2M0NmY3ZjItYmE0NC00Zjg5LTkzN2UtYjE5YjAwYTE3MDMxIiwiVXNlck5hbWUiOiJTeXN0ZW0iLCJEYXRlQ3JlYXRlZCI6IjIwMjQtMDYtMjZUMDk6NDc6NDYuNzIxOTk0NisxMDowMCIsIklzQXBpS2V5Ijp0cnVlLCJJc1NzbyI6ZmFsc2V9.x8Tai4jbTjYZfGjE-xx-wKD5VwZELouMTkE7InfOBxc',
    'x-api-version': '1.0'
}
const typeOfIssues = ["Non-conformance", "Improvement opportunity"];
const origins = ["Internal", "External"];

document.addEventListener('DOMContentLoaded', function() {
    getImprovementSources();
    addDataToSelectElement(document.getElementById('typeOfIssue'), typeOfIssues);
    addDataToSelectElement(document.getElementById('origin'), origins);
    
    document.getElementById('improvementForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const form = event.target;
        const data = {
            isExternal: form.origin.value == "External" ? true : false,
            externalSource: form.externalSource.value,          
            isNonconformance: form.typeOfIssue.value == "Non-conformance" ? true : false,
            improvementSource : form.improvementSource.value,
            text: form.text.value,            
            recommendation: form.recommendation.value,
            additionalComment: form.additionalComment.value         
        };            
        
        let url = baseUrl + "improvement";

        fetch(url, {
            method: 'POST',
            headers: baseHdr,
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('API endpoint not found (404).');
                } else {
                    throw new Error('An error occurred: ' + response.statusText);
                }
            }
            return response.json();
        })
        .then(data => {
            alert('Improvement submitted successfully!');
            console.log('Logiqc API returned: ' + data)
            form.reset();
        })
        .catch(error => {
            debugger;
            console.error('Error:', error);
            alert('An error occurred while submitting your improvement');
        });
    });
});


function getImprovementSources() {    
    let url = baseUrl + "improvement/sources";
    getDropDownData(url, 'improvementSource');   
}



function getDropDownData(url, name) {
    const selectElement = document.getElementById(name);    

    fetch(url, {
            method: 'GET',
            headers: baseHdr
        })
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch ' + name);
            }
            return response.json();
        })
        .then(data => {
            addBlankOption(selectElement);
            addDataToSelectElement(selectElement, data);
        })
        .catch(error => {
            console.error('$Error fetching {name}:', error);
        });  
}



function addDataToSelectElement(selectElement, data) {
    data.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        selectElement.appendChild(option);
    });
}

function addBlankOption(selectElement, placeholderText = '') {
    const blankOption = document.createElement('option');
    blankOption.value = ''; 
    blankOption.textContent = placeholderText; 
    selectElement.appendChild(blankOption);
}

