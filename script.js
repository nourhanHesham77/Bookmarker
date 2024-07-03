var subBtn = document.getElementById("sub");
var nameInput = document.getElementById("exampleInputname");
var urlInput = document.getElementById("exampleInputURL");
var table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
var alert =  document.getElementById('alert');


subBtn.addEventListener("click", (e) => {
    e.preventDefault();
    var val = urlInput.value;
    searchInput();
    
    let url = decodeURIComponent(val);
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = 'https://' + url
    }
    
    if(searchInput()){
        alert.style.display = "none";
    const webObj = {
        id: randomId(),
        Name: nameInput.value,
        URL: url
    };
    
    let existingData = localStorage.getItem('web');
    
    try {
        existingData = JSON.parse(existingData);
        // JSON.parse converts a JSON-formatted string into a JavaScript object
        if (!Array.isArray(existingData)) {
            existingData = [];
        }
    } catch (e) {
        existingData = [];
    }

    existingData.push(webObj);
    localStorage.setItem('web', JSON.stringify(existingData));
    getDataFromLocalStorage();
}else{
    nameInput.classList.remove("success");
    alert.style.display = "block";
    if(nameInput.value == ""){
        alert.innerHTML="name is empty";
    }else{
        alert.innerHTML="name already exists";
    }
}
    clearInputs();
});

let count = 0;
function randomId() {
  var length = 4;
  return Math.random().toString(36).substring(2, length+2);
};

function addToTable(dataObject) {
  let counter = 1; 
    dataObject.forEach(data => {
        const tr = document.createElement("tr");
        const th = document.createElement("td");
        const webName = document.createElement("td");
        const tdVisit = document.createElement("td");
        const tdDelete = document.createElement("td");
        table.appendChild(tr);
        tr.appendChild(th);
        tr.appendChild(webName);
        tr.appendChild(tdVisit);
        tr.appendChild(tdDelete);
        th.innerText = counter;
        webName.innerText = data.Name;

        const visitButton = document.createElement('button');
        visitButton.id = 'visit-btn';
        const visitLink = document.createElement('a');
        visitLink.href = data.URL;
        visitLink.innerHTML = '<i class="fa-solid fa-eye"></i> visit';
        visitButton.appendChild(visitLink);
        tdVisit.appendChild(visitButton);
        visitLink.setAttribute("target", "_blank");

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute("class", 'btn btn-danger');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i> Delete';
        deleteButton.onclick = function () {
            deleteData(data.id);
        };
        tdDelete.appendChild(deleteButton);
        counter++;
    });
    
    
}

function getDataFromLocalStorage() {
    let storedUserData = localStorage.getItem('web');
    try {
        storedUserData = JSON.parse(storedUserData);
        if (!Array.isArray(storedUserData)) {
            storedUserData = [];
        }
    } catch (e) {
        storedUserData = [];
    }

    table.innerHTML = '';  
    addToTable(storedUserData);
    return storedUserData;
}

function deleteData(id) {
    let existingData = localStorage.getItem('web');
    try {
        existingData = JSON.parse(existingData);
        if (Array.isArray(existingData)) {
            existingData = existingData.filter(item => item.id !== id);
            localStorage.setItem('web', JSON.stringify(existingData));
            //convert string (shape of json with no error) to json
            getDataFromLocalStorage();
        }
    } catch (e) {
        console.error("Error parsing localStorage data", e);
    }
}

window.onload = function () {
    getDataFromLocalStorage();
};


/**validation */
nameInput.addEventListener("input",()=>{
    var val = nameInput.value;
    if(val.length<3){
        nameInput.classList.remove("success");
        nameInput.classList.add("error");
        console.log("error")
    }else{
        nameInput.classList.remove("error");
        nameInput.classList.add("success");
    }
})

urlInput.addEventListener("input",()=>{
    var val = urlInput.value;
    pattern = /^[^\.]*\.[a-zA-Z]{2,}$/;
     let res;

    if (/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/.test(val)) {
    
    res = true;
    console.log("first: "+res);
    
    }else{
        res =pattern.test(val);
        console.log(pattern.test(val));
    }
    if( res){
        urlInput.classList.remove("error");
        urlInput.classList.add("success");
    }else{
       
        urlInput.classList.remove("success");
        urlInput.classList.add("error");
        console.log("error")
    }
})



/**Clear Inputs after submit and remove style */
function clearInputs(){
    nameInput.value = null;
    urlInput.value = null;
    // document.getElementById("form").reset();
    nameInput.classList.remove("success");
    urlInput.classList.remove("success");
}


/**Search Input to check if it already exist or not */
function searchInput(){
    var name = nameInput.value.toLowerCase();
    dataToCheck = getDataFromLocalStorage();
    var result = true;
    
    for (let i = 0; i < dataToCheck.length; i++) {
        
        if (dataToCheck[i].Name.toLocaleLowerCase() == name) {
            result = false;
            break; 
    }

    if(nameInput.value == ""){
        result = false;
    }
}

return result;
    
}