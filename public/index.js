function showFileName(){
    let fileInput = document.getElementById('file');
    fileInput.addEventListener('change', ()=>{
        let fileName = fileInput.files[0].name;
        let fileNameEl = document.querySelector(".uploadContainer .text span");
        fileNameEl.innerText = fileName;

        if(!isExcelFile(fileInput.files[0])){
            alert("Invalid file type, only Excel is allowed!");
            fileInput.value = "";
            fileNameEl.innerText = "Choose another file";
        }
    });
}
showFileName();

function isExcelFile(file) {
    // Check if the file's MIME type is .xlsx or .xls
    if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
        file.type === "application/vnd.ms-excel") {
      return true;
    } else {
      return false;
    }
  }

  async function uploadFile(){
    let fileInput = document.getElementById('file');
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append('file', file);
    let sheetName = document.getElementById('sheetName').value.trim();
    formData.append('sheetName', sheetName);
    if(sheetName === ""){
        alert("Sheet name is required!");
        return;
    }else if(file === undefined){
        alert("File is required!");
        return;
    }
    try{
        document.querySelector("#loader").classList.remove("hidden");
        let response = await fetch('/excel', {
            method: 'POST',
            body: formData
        });
        if(response.ok){
            document.querySelector("#loader").classList.add("hidden");

            document.querySelector(".uploadContainer").classList.add("hidden");
            let downloadBtn = document.querySelector(".download-button");
            downloadBtn.classList.remove("hidden");
            let downloadLink = document.createElement("a");
            downloadLink.href = "/b.xlsx";
            downloadLink.download = "categorized.xlsx";
            downloadLink.classList.add("hidden");
            document.body.appendChild(downloadLink);
            downloadBtn.addEventListener('click', ()=>{
                downloadLink.click();
            });

        }
    }catch(err){
        document.querySelector("#loader").classList.add("hidden");
        console.log(err);
    }
  }
  document.querySelector(".submitBtn").addEventListener('click', uploadFile);