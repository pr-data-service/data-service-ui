import moment from "moment";
import { ToWords } from 'to-words';

const formatDate = (value) => {
    let strDt = moment(value).format('YYYY-MMM-DD hh:mm:ss a') ;
    return strDt
}

/*  HH for 24 hour &  hh for 12 hour
*/
const formatDateForAPI = (value) => {
    let strDate = value.split("T")[0] + " " + value.split("T")[1] + "00";
    let strDt = moment(value).format('YYYY-MM-DD HH:mm:ss') ;     //HH for 24 hour & hh for 12 hour

    return strDt == "Invalid date" ? "" : strDt;
}

const convertAmountInWords = (amount) => {
    let words = "";
    try {
        if(amount && amount != "") {
            const toWords = new ToWords({
                localeCode: 'en-US',
                converterOptions: {
                  currency: true,
                  ignoreDecimal: false,
                  ignoreZeroCurrency: false,
                }
              });
             words = toWords.convert(amount, { currency: true });
             words = words.replaceAll("Only", "");
        }
    } catch (error) {
        console.error(error);
    }
    return words;
}

export default {
    formatDate,
    formatDateForAPI,
    convertAmountInWords
}