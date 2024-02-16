const Excel = require("./xlsxConfig.js");
const path = require("path");

const categories = [
    "FAKTURA",
    "POVRACAJ",
    "DOBAVLJACI",
    "INTERNI PRENOS",
    "KAMATA",
    "KARTICE",
    "PDV",
    "LIZING",
    "OTKUPNINA",
    "POREZ",
    "POZAJMICE",
    "UPLATA PAZARA",
    "ZARADE",
    "ZAKUP",
    "TAKSA",
    "PROVIZIJE"
]



const categorize = function(excelFilePath, sheetName){
    let jsonData = Excel.readExcel(excelFilePath, sheetName);
    jsonData.forEach((row) => {
        //ucitavamo sta pise u polju transakcija
        let transakcija;
        for(let key in row){
            if(key.toLowerCase().includes("transakcija")){
                transakcija = row[key];
                break;
            }
        }
        if(transakcija != undefined){
            if(typeof transakcija != "string"){
                transakcija = transakcija.toString();
            }
        
            transakcija = prevediTransakciju(transakcija);

            let cardRegex = /\d{4}\*{8}\d{4}/;

            switch(true){
                case transakcija.includes("pdv"):
                    row["Kat"] = "PDV";
                    break;
                case transakcija.includes("lizing"):
                    row["Kat"] = "LIZING";
                    break;
                case transakcija.includes("otkupnina"):
                    row["Kat"] = "OTKUPNINA";
                    break;
                case transakcija.includes("povracaj"):
                    row["Kat"] = "POVRACAJ";
                    break;
                case transakcija.includes("zarade") || transakcija.includes("zarada"):
                    row["Kat"] = "ZARADE";
                    break;
                case transakcija.includes("uplata") && transakcija.includes("pazar"):
                    row["Kat"] = "UPLATA PAZARA";
                    break;
                case transakcija.includes("provizije") || transakcija.includes("provizija"):
                    row["Kat"] = "PROVIZIJE";
                    break;
                case transakcija.includes("uplata") && transakcija.includes("porez"):
                    row["Kat"] = "POREZ";
                    break;
                case transakcija.includes("kamata") || transakcija.includes("kamate") || transakcija.includes("rata"):
                    row["Kat"] = "KAMATA";
                    break;
                case transakcija.includes("pozajmica") || transakcija.includes("ugovor") && transakcija.includes("zajm"):
                    row["Kat"] = "POZAJMICE";
                    break;
                case transakcija.includes("master business") || cardRegex.test(transakcija):
                    row["Kat"] = "KARTICE";
                    break;
                case transakcija.includes("taksa"):
                    row["Kat"] = "TAKSA";
                    break;
                case transakcija.includes("prenos") && transakcija.includes("sredstava") && transakcija.includes("za") && transakcija.includes("naknada") && transakcija.includes("trosk"):
                    row["Kat"] = "PREVOZ";
                    break;
                case transakcija.includes("prihodi") && transakcija.includes("fiz") && transakcija.includes("lica"):
                    row["Kat"] = "ZAKUP";
                    break;
                case transakcija.includes("druge transakcije"):
                    let komitent = "komitent";
                    for(let key in row){
                        if(key.toLowerCase().includes("komitent")){
                            komitent = row[key];
                            break;
                        }
                    }
                    // console.log(komitent);
                    if(komitent.toLowerCase().includes("galena") || komitent.toLowerCase().includes("midmeding")){
                        row["Kat"] = "INTERNI PRENOS";
                    }
                    break;
                case testirajZaFakturu(transakcija, row):
                    row["Kat"] = "FAKTURA";
                    break;

                case testirajZaDobavljaca(transakcija, row):
                    row["Kat"] = "DOBAVLJACI";
                    break;
                default:
                    row["Kat"] = "OSTALO";
            }
        }
    });

    Excel.makeExcel(jsonData, "RSD 2024");
}

function prevediTransakciju(transakcija){
    let translatedTransaction = transakcija.toLowerCase().trim();
    const serbianToEnglishDict = {
        'č': 'c',
        'ć': 'c',
        'đ': 'dj',
        'š': 's',
        'ž': 'z'
    };
    for (let serbian in serbianToEnglishDict) {
        let english = serbianToEnglishDict[serbian];
        let regex = new RegExp(serbian, 'g');
        translatedTransaction = translatedTransaction.replace(regex, english);
    }

    return translatedTransaction;
}
function testirajZaFakturu(transakcija, row){
    let faktura = false;
    for(let key in row){
        if(key.toLowerCase().includes("odliv")){
            return faktura;
        }else if(key.toLowerCase().includes("priliv")){
            if(transakcija.includes("promet") && transakcija.includes("rob") && transakcija.includes("uslug")){
                faktura = true;
            }else if(transakcija.includes("uplata po")){
                faktura = true;
            }else if(transakcija.includes("po racunu")){
                faktura = true;
            }else if(transakcija.includes("transakcij") && transakcija.includes("nalog")){
                faktura = true;
            }else if(transakcija.includes("uslugu") || transakcija.includes("robu")){
                faktura = true;
            }else if(transakcija.includes("specifikacij")){
                faktura = true;
            }
            return faktura;
        }
    }
    return faktura;
}
testirajZaDobavljaca = (transakcija, row) => {
    let dobavljac = false;
    for(let key in row){
        if(key.toLowerCase().includes("odliv")){
            if(transakcija.includes("uplata") && transakcija.includes("racun")){
                dobavljac = true;
            }else if(transakcija.includes("placanje") && transakcija.includes("racun")){
                dobavljac = true;
            }
            return dobavljac;
        }
    }
}

// categorize(path.join(__dirname, "..", "a.xlsx"), "RSD 2024");
// {
//     '*': '*',
//     ' DATUM ': 45301,
//     ' Kraći opis ': 'AU TILIA NOVI SAD - POVRAĆAJ VIŠE  NAPLAĆENIH NOVČANIH',
//     ' Komitent ': 'AU TILIA NOVI SAD',
//     ' Transakcija ': 'POVRAĆAJ VIŠE  NAPLAĆENIH NOVČANIH',
//     ' ODLIV ': 16352.12,
//     ' Kategorija ': 'Povracaj',
//     ' BROJ RACUNA NASE APOTEKE ': '205-000000027104798',
//     ' Mesec ': 1
//   },

module.exports = {categorize};