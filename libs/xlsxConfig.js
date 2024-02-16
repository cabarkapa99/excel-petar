const xlsx = require("xlsx");
const path = require("path")

const makeExcel = function(jsonData, sheetName){

    // Create a new workbook
    const wb = xlsx.utils.book_new();
    
    
    // Create a worksheet for the first sheet
    const ws1 = xlsx.utils.json_to_sheet(jsonData);
    
    // Add the first sheet to the workbook with the desired name
    xlsx.utils.book_append_sheet(wb, ws1, sheetName);
    
    // Save the workbook to a file
    xlsx.writeFile(wb, path.join(__dirname, "..", "public", "b.xlsx"), { bookType: 'xlsx' });
    // return XLSX.write(wb,{ type: 'buffer', bookType: 'xlsx' });
    
    console.log('Excel file created.');
    
}

const readExcel = function(filePath, firstSheetName){
  console.log("Excel file read.")
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  // console.log(jsonData);
  return jsonData;
}

module.exports = {
    makeExcel,
    readExcel
}