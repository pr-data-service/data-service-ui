import apiUrl from "../constants/apiUrl"
import HttpClient from "./httpClient"


const getState = () => {
    try{
        return HttpClient.get(apiUrl.STATE_GET);        
    }catch(error){
        console.error(error);
    }  
}

const getPropertyTax = (state, city) => {
    try{
        return HttpClient.get(apiUrl.PROPERTY_TAX_GET+"/"+state+"/"+city);        
    }catch(error){
        console.error(error);
    }  
}


const save = (params) => {

    let promise = HttpClient.get(apiUrl.USER_SAVE, params);
    if(promise.status && promise.status == 200 && promise.data.status == 0) {
        return promise.data.data;
    }    
}


const onFormSubmit = (data) => {		
    try {        
        console.log("Raw Data: " + JSON.stringify(data));
        
        var formattedDataForExcel = formatDataForExcel(data);
        console.log("Resulr Data: " + JSON.stringify(formattedDataForExcel));

        let params = {rawData: data, processedData: formattedDataForExcel};

        return HttpClient.post(apiUrl.DATA_DRAFTING_SERVICE_SAVE, params);
    } catch(error){
        console.error(error);
    }
}

const formatDataForExcel = (data) => {
    var proessedData = null;
    try{
        var calcData = calculateData(data);
                            
        var propTaxForLoanPeriod = calcData.propTaxForLoanPeriod && calcData.propTaxForLoanPeriod > 0 ? "$  " + addCommas(calcData.propTaxForLoanPeriod) : "NA";
        var pmiPerAnnum = calcData.pmiPerAnnum && calcData.pmiPerAnnum > 0 ? "$  " + addCommas(calcData.pmiPerAnnum) : "NA";								
        
        proessedData = {
            //WORK LOAD
            workLoad: data.workLoad,
            
            //CUSTOMER REFRENCE NUMBER
            cRefNo: data.cRefNo, 
            
            //CUSTOMER NAME
            cName: data.cName, 
            
            //CITY, STATE
            cityState: data.city + " , " + data.state,
            
            //ACTUAL PURCHASE VALUE
            purchaseVal: "$  " + addCommas(data.purchaseVal),
            
            //PURCHASE VALUE AND DOWN PAYMENT
            purchaseValAndDownPayment: "$  "+ addCommas(calcData.purchaseVal) + " AND " + data.downPayment + " %", 
            
            //LOAN PERIOD AND ANNUAL INTEREST IN PERCENTAGE
            loanPeriodAndAnnualInterest: data.loanPeriod + " YEARS AND " + data.annualInterest+"%",
            
            //GUARANTOR NAME
            guarantorName: data.guarantorName,
            
            //GUARANTOR NUMBER
            guarantorNo: data.guarantorNo, 
            
            //LOAN AMOUNT AND PRINCIPAL
            loanAmountAndPrincipal: "$  "+ addCommas(calcData.loanAmount) + " AND $  "+ addCommas(calcData.principal), 
            
            //INTEREST FOR TOTAL LOAN PERIOD AND PROPERTY TAX FOR LOAN PERIOD
            intForTotLoanPeriodAndPropTaxForLoanPeriod: "$  "+ addCommas(calcData.intForTotLoanPeriod) + " AND "+ propTaxForLoanPeriod,
            
            //"PROPERTY INSURANCE PER MONTH AND PMI PER ANNUM" 
            propInsurPerMonthAndPmiPerAnnum: "$  "+ addCommas(calcData.propInsurPerMonth) + " AND "+ pmiPerAnnum,
        };
        console.log("proessedData: " + JSON.stringify(proessedData));
        
        /*
        {purchaseVal: 0, loanAmount: 0, principal: 0, intForTotLoanPeriod: 0,
                    propTaxForLoanPeriod: 0, propInsurPerMonth: 0, pmiPerAnnum: 0};*/						
                    
    }catch(error){
        console.error(error);
    }
    return proessedData;
}

const addCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "  ,  ");
    return parts.join(".");
}

const calculateData = (data) => {
    var calcData = {purchaseVal: 0, loanAmount: 0, principal: 0, intForTotLoanPeriod: 0,
                    propTaxForLoanPeriod: 0, propInsurPerMonth: 0, pmiPerAnnum: 0};
    try {
        //Purchase value Calculation
        try {
            if(data.purchaseVal > 0 && data.purchaseValReduc > 0) {
                var purchaseVal = makeDecimalPlace(data.purchaseVal, 2);
                var reducedValue = (purchaseVal  * data.purchaseValReduc) / 100;
                reducedValue = makeDecimalPlace(reducedValue, 2);
                purchaseVal = purchaseVal - reducedValue;
                calcData.purchaseVal = makeDecimalPlace(purchaseVal, 2);
            }
        } catch(err) {
            console.error("Purchase value Calculation: " + err);
        }
        
        //Loan amount calculation
        try {
            if(calcData.purchaseVal > 0 && data.downPayment > 0) {
                var downPayment = makeDecimalPlace(data.downPayment, 2);
                var reducedValue = (calcData.purchaseVal  * downPayment) / 100;
                reducedValue = makeDecimalPlace(reducedValue, 2);
                var loanAmount = calcData.purchaseVal - reducedValue;
                loanAmount = makeDecimalPlace(loanAmount, 2);
                calcData.loanAmount = loanAmount;
            }
        } catch(err) {
            console.error("Loan amount calculation error: " + err);
        }
        
        //Principal Calculation
        try {
            if(calcData.loanAmount > 0 && data.loanPeriod > 0) {
                var loanPeriod = makeDecimalPlace(data.loanPeriod, 2);
                var monthPrincReduc = makeDecimalPlace(data.monthPrincReduc, 2);
                
                var annualPrincipal = calcData.loanAmount / loanPeriod;
                annualPrincipal = makeDecimalPlace(annualPrincipal, 2);
                var monthlyPrincipal = annualPrincipal / 12;
                monthlyPrincipal = makeDecimalPlace(monthlyPrincipal, 2);
                var principal = (monthlyPrincipal  * monthPrincReduc) / 100;
                principal = makeDecimalPlace(principal, 2);
                calcData.principal = principal;
            }
        } catch(err) {
            console.error("Principal Calculation error: " + err);
        }
        
        
        //Total interest for loan period Calculation
        try {
            if(calcData.loanAmount > 0 && data.annualInterest > 0 && data.loanPeriod > 0) {
                var annualInterest = makeDecimalPlace(data.annualInterest, 2);
                var loanPeriod = makeDecimalPlace(data.loanPeriod, 2);
                var totIntReduc = makeDecimalPlace(data.totIntReduc, 2);
                
                var totalInterestPerAannum = (calcData.loanAmount  * annualInterest) / 100;
                totalInterestPerAannum = makeDecimalPlace(totalInterestPerAannum, 2);
                var intForTotLoanPeriod = totalInterestPerAannum * loanPeriod;
                var intForTotLoanPeriod = (intForTotLoanPeriod  * totIntReduc) / 100;
                intForTotLoanPeriod = makeDecimalPlace(intForTotLoanPeriod, 2);
                calcData.intForTotLoanPeriod = intForTotLoanPeriod
            }
        } catch(err) {
            console.error("Total interest for loan period Calculation error: " + err);
        }
        
        
        //Property tax for loan period Calculation
        try {
            if(calcData.loanAmount > 0 && data.loanPeriod > 0 
                && data.propTaxReducPrcntg && data.propTaxReducPrcntg != "" && data.propTaxReducPrcntg > 0 ) {
                var propTaxReducPrcntg = makeDecimalPlace(data.propTaxReducPrcntg, 2);
                var loanPeriod = makeDecimalPlace(data.loanPeriod, 2);
                
                var reducedValue = (calcData.loanAmount  * propTaxReducPrcntg) / 100;
                reducedValue =  makeDecimalPlace(reducedValue, 2);
                var taxPerAnnum = (reducedValue * 2) / 100;
                taxPerAnnum =  makeDecimalPlace(taxPerAnnum, 2);
                var propTaxForLoanPeriod = taxPerAnnum * loanPeriod;
                propTaxForLoanPeriod = makeDecimalPlace(propTaxForLoanPeriod, 2);
                calcData.propTaxForLoanPeriod = propTaxForLoanPeriod;
            }
        } catch(err) {
            console.error("Property tax for loan period Calculation error: " + err);
        }
        
        //Property insurance per month calculation
        try {
            if(data.downPayment > 0 && calcData.loanAmount > 0) {
                var loanPercentage = 100 - data.downPayment;
                var interestRate = getPropertyInsuranceInterestRate(loanPercentage, data.loanPeriod);
                var insurancePerAnnum = (calcData.loanAmount  * interestRate) / 100;
                insurancePerAnnum = makeDecimalPlace(insurancePerAnnum, 2);
                var propInsurPerMonth = insurancePerAnnum / 12;
                propInsurPerMonth = makeDecimalPlace(propInsurPerMonth, 2);
                calcData.propInsurPerMonth = propInsurPerMonth;
            }
        } catch(err) {
            console.error("Property insurance per month calculation error: " + err);
        }
        
        //PMI per annum Calculation
        try {
            if(data.downPayment > 0 && calcData.loanAmount > 0) {
                var loanPercentage = 100 - data.downPayment;
                var interestRate = getPMIInsuranceInterestRate(loanPercentage, data.loanPeriod);
                if(interestRate > 0) {
                    var pmiPerAnnum = (calcData.loanAmount  * interestRate) / 100;
                    pmiPerAnnum = makeDecimalPlace(pmiPerAnnum, 2);
                    calcData.pmiPerAnnum = pmiPerAnnum;
                }
            }
        } catch(err) {
            console.error("PMI per annum Calculation error: " + err);
        }
    }catch(error){
        console.error(error);
    }
    return calcData;
}

const makeDecimalPlace = (val, noOfPlace) => {
    var parts = val.toString().split(".");
    if(parts && parts[1] && parts[1] != "" && parts[1].length > noOfPlace) {
         parts[1] = parts[1].substring(0, noOfPlace);
         return parts.join(".");
    }
    return val;
}

const getPropertyInsuranceInterestRate = (loanPercentage, loanPeriod) => {
    var interestRate = 0;
    try{
        if(loanPercentage >= 1 && loanPercentage <= 84.99) {
            if(loanPeriod >= 1 && loanPeriod <= 25) {
                interestRate = 0.32;
            } else if(loanPeriod >= 26 && loanPeriod <= 30) {
                interestRate = 0.32;
            }
        } else if(loanPercentage == 85) {
            if(loanPeriod >= 1 && loanPeriod <= 25) {
                interestRate = 0.21;
            } else if(loanPeriod >= 26 && loanPeriod <= 30) {
                interestRate = 0.32;
            }
        } else if(loanPercentage >= 85.01 && loanPercentage <= 90) {
            if(loanPeriod >= 1 && loanPeriod <= 25) {
                interestRate = 0.41;
            } else if(loanPeriod >= 26 && loanPeriod <= 30) {
                interestRate = 0.52;
            }
        } else if(loanPercentage >= 90.01 && loanPercentage <= 95) {
            if(loanPeriod >= 1 && loanPeriod <= 25) {
                interestRate = 0.67;
            } else if(loanPeriod >= 26 && loanPeriod <= 30) {
                interestRate = 0.78;
            }
        } else if(loanPercentage >= 95.01) {
            if(loanPeriod >= 1 && loanPeriod <= 25) {
                interestRate = 0.85;
            } else if(loanPeriod >= 26 && loanPeriod <= 30) {
                interestRate = 0.96;
            }
        }
    }catch(error){
        console.error(error);
    }
    return interestRate;
}

const getPMIInsuranceInterestRate = (loanPercentage, loanPeriod) => {
    var interestRate = 0;
    try{
        if(loanPercentage >= 1 && loanPercentage <= 80) {				
            if(loanPeriod >= 1 && loanPeriod <= 20) {
                //No calculation is required
            } else if(loanPeriod >= 21 && loanPeriod <= 30) {
                //No calculation is required
            }
        } else if(loanPercentage >= 80.01 && loanPercentage <= 85) {
            if(loanPeriod >= 1 && loanPeriod <= 20) {
                interestRate = 0.19;
            } else if(loanPeriod >= 21 && loanPeriod <= 30) {
                interestRate = 0.32;
            }
        } else if(loanPercentage >= 85.01 && loanPercentage <= 90) {
            if(loanPeriod >= 1 && loanPeriod <= 20) {
                interestRate = 0.23;
            } else if(loanPeriod >= 21 && loanPeriod <= 30) {
                interestRate = 0.52;
            }
        } else if(loanPercentage >= 90.01 && loanPercentage <= 95) {
            if(loanPeriod >= 1 && loanPeriod <= 20) {
                interestRate = 0.26;
            } else if(loanPeriod >= 21 && loanPeriod <= 30) {
                interestRate = 0.78;
            }
        } else if(loanPercentage >= 95.01 && loanPercentage <= 97) {
            if(loanPeriod >= 1 && loanPeriod <= 20) {
                interestRate = 0.79;
            } else if(loanPeriod >= 21 && loanPeriod <= 30) {
                interestRate = 0.90;
            }
        }
    }catch(error){
        console.error(error);
    }
    return interestRate;
}

const getListViewRawData = (filterParams) => {
    try{
        return HttpClient.get(apiUrl.DATA_DRAFTING_SERVICE_LIST_VIEW_GET, filterParams);        
    }catch(error){
        console.error(error);
    }  
}

const getRawDataById = (id) => {
    try{
        return HttpClient.get(apiUrl.DATA_DRAFTING_SERVICE_GET+"/"+id);        
    }catch(error){
        console.error(error);
    }  
}

const deleteRawDataById = (id) => {
    try{
        return HttpClient.delete(apiUrl.DATA_DRAFTING_SERVICE_DELETE+"/"+id);        
    }catch(error){
        console.error(error);
    }  
}

const deleteRawData = (params) => {
    try{
        return HttpClient.post(apiUrl.DATA_DRAFTING_SERVICE_DELETE_BATCH, params);        
    }catch(error){
        console.error(error);
    }  
}

const getListViewResultData = (filterParams) => {
    try{
        return HttpClient.get(apiUrl.DATA_DRAFTING_SERVICE_RESULT_LIST_VIEW_GET, filterParams);        
    }catch(error){
        console.error(error);
    }  
}
const downloadExcel = (filterParams, headers) => {
    try{
        return HttpClient.downloadFile(apiUrl.DATA_DRAFTING_SERVICE_RESULT_DOWNLOAD_EXCEL, filterParams, headers);
    }catch(error){
        console.error(error);
    }  
}

const isDuplicateRawData = (params) => {
    try{
        return HttpClient.post(apiUrl.DATA_DRAFTING_SERVICE_IS_DUPLICATE, params);        
    }catch(error){
        console.error(error);
    }  
}

export default {
    getState,
    getPropertyTax,
    save,
    onFormSubmit,
    getListViewRawData,
    getRawDataById,
    deleteRawDataById,
    deleteRawData,
    getListViewResultData,
    downloadExcel,
    isDuplicateRawData
}