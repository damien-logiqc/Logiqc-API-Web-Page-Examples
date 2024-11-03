const baseUrl = "https://1a8aec84-215e-43fb-a052-fff56d0599a7.mock.pstmn.io/api/";
const baseHdr = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbklkIjoiN2M0NmY3ZjItYmE0NC00Zjg5LTkzN2UtYjE5YjAwYTE3MDMxIiwiVXNlck5hbWUiOiJTeXN0ZW0iLCJEYXRlQ3JlYXRlZCI6IjIwMjQtMDYtMjZUMDk6NDc6NDYuNzIxOTk0NisxMDowMCIsIklzQXBpS2V5Ijp0cnVlLCJJc1NzbyI6ZmFsc2V9.x8Tai4jbTjYZfGjE-xx-wKD5VwZELouMTkE7InfOBxc',
    'x-api-version': '1.0'
}
var subcategories = [];


document.addEventListener('DOMContentLoaded', function() {
    getFeedbackTypes();
    getFeedbackSources();
    getFeedbackCategories();
    getFeedbackSubcategories();

    const categorySelect = document.getElementById('feedbackCategory');

    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        populateSubcategories(selectedCategory);
    });
    
    document.getElementById('feedbackForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const form = event.target;
        const data = {
            feedbackType: form.feedbackType.value,
            source: form.source.value,          
            feedbackCategory: form.feedbackCategory.value,
            feedbackSubCategory : form.feedbackSubCategory.value,
            dateReceived: getCurrentDateTime(),
            hasFeedbackProvider: true,
            providerName: form.name.value,
            providerAddressLine: "73 Jupiter St",
            providerCity: "Brisbane",
            providerState: "QLD",
            providerPostCode: "4020",
            providerEmail: form.email.value,
            providerPhone: form.phone.value,
            text: form.comment.value,        
        };            
        
        let url = baseUrl + "feedback";

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
            alert('Feedback submitted successfully!');
            console.log('Logiqc API returned: ' + data)
            form.reset();
        })
        .catch(error => {
            debugger;
            console.error('Error:', error);
            alert('An error occurred while submitting your feedback.');
        });
    });
});


function getFeedbackTypes() {    
    let url = baseUrl + "feedback/types";
    getDropDownData(url, 'feedbackType');   
}

function getFeedbackSources() {    
    let url = baseUrl + "feedback/sources";
    getDropDownData(url, 'source');   
}

function getFeedbackCategories() {    
    let url = baseUrl + "feedback/categories";
    getDropDownData(url, 'feedbackCategory');   
}

function getFeedbackSubcategories() {
       
    let url = baseUrl + "feedback/subcategories";

    fetch(url, {
            method: 'GET',
            headers: baseHdr
        })
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch feedback subcategories');
            }
            return response.json();
        })
        .then(data => {
            subcategories = data;
        })
        .catch(error => {
            console.error('Error fetching feedback subcategories:', error);
        });
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

function populateSubcategories(selectedCategory) {
    const selectElement = document.getElementById('feedbackSubCategory');
    selectElement.innerHTML = '';
    addBlankOption(selectElement);

    // filter subcategories based on selected category and add options
    const filteredSubcategories = subcategories.filter(item => item.category === selectedCategory);
    
    filteredSubcategories.forEach(item => {
        const option = document.createElement('option');
        option.value = item.subcategory;
        option.textContent = item.subcategory;
        selectElement.appendChild(option);
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

function getCurrentDateTime() {
    const now = new Date(); // Get the current date and time

    // Format date and time parts
    const year = now.getFullYear(); // e.g., 2024
    const month = String(now.getMonth() + 1).padStart(2, '0'); // e.g., 06 (Months are 0-based in JS)
    const day = String(now.getDate()).padStart(2, '0'); // e.g., 14

    const hours = String(now.getHours()).padStart(2, '0'); // e.g., 01
    const minutes = String(now.getMinutes()).padStart(2, '0'); // e.g., 23
    const seconds = String(now.getSeconds()).padStart(2, '0'); // e.g., 45

    // Combine into ISO 8601 format: "YYYY-MM-DDTHH:MM:SS"
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}