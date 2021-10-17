const dateInput = document.querySelector("#input-date");
const checkBtn = document.querySelector("#check-if-palindrome");
const output = document.querySelector("#output");


function getDateAsStr(date) {
    var dateStr = { day: "", month: "", year: ""};

    if((typeof date.day === 'string' || date.day instanceof String) && date.day.length < 2) {
        dateStr.day = "0"+date.day;
    } else if ((typeof date.day === 'number' || date.day instanceof Number) && date.day <10) {
        dateStr.day ="0"+ date.day;
    } else {
        dateStr.day = String(date.day);
    }
    if((typeof date.month === 'string' || date.month instanceof String) && date.month.length <2) {
        dateStr.month = "0"+date.month;
    }else if((typeof date.month === 'number' || date.day instanceof Number) && date.month<10) {
        dateStr.month = "0"+date.month;
    } else {
        dateStr.month = String(date.month);
    }
    
    dateStr.year = String(date.year);
    return dateStr;
}

function getEveryDateFormat(dateDict) {
    
    var ddmmyyyy = dateDict.day + dateDict.month + dateDict.year;
    var mmddyyyy = dateDict.month + dateDict.day + dateDict.year;
    var yyyymmdd = dateDict.year + dateDict.month + dateDict.day;
    var ddmmyy = dateDict.day + dateDict.month + dateDict.year.slice(-2);
    var mmddyy = dateDict.month + dateDict.day + dateDict.year.slice(-2);
    var yymmdd = dateDict.year.slice(-2) + dateDict.month + dateDict.day;

    return [ddmmyyyy,mmddyyyy,yyyymmdd,ddmmyy,mmddyy,yymmdd];
}

function reverseString(str) {
    var revStr = str.split('').reverse().join('');
    
    return revStr;
}

function checkIfPalindrome(everyFormatDates) {
    var checkMark = false;
    var dateFormatRef = ["dd-mm-yyyy","mm-dd-yyyy","yyyy-mm-dd",
    "dd-mm-yy", "mm-dd-yy","yy-mm-dd"];
    var dateFormat = "";

    for(let i=0;i<everyFormatDates.length; i++) {
        let reverseDate = reverseString(everyFormatDates[i]);
        if (everyFormatDates[i] === reverseDate) {
            checkMark = true;
            dateFormat = dateFormatRef[i];
            break;
        }
    }

    return [checkMark, dateFormat];
}

function leapYear(year) {
    if(year % 400 === 0) {
        return true;
    }
    if(year % 100 === 0) {
        return false;
    }
    if(year % 4 === 0) {
        return true;
    }
    return false;
}

function getPreviousDate(date) {
    day = date.day-1;
    month = date.month;
    year= date.year;
    var daysOfMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    

    if(day === 0) {
        if(month === 3) {
            if(leapYear(year)) {
                month--;
                day = 29;
            } else {
                month--;
                day = daysOfMonth[month-1];
            }
        } else {
            month--;
            day = daysOfMonth[month-1];
        }
        
    }
    if(month === 0) {
        month = 12;
        day = daysOfMonth[month-1];
        year--;
    }

    return {day:day, month:month, year:year};
}

function getNextDate(date) {
    day = date.day+1;
    month = date.month;
    year = date.year;
    daysOfMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

    if(month === 2) {
        if(leapYear(year)) {
            if(day>29) {
                day = 1;
                month++;
            }
        } else {
            if(day>28) {
                day = 1;
                month++;
            }
        }
    } else {
        if(day > daysOfMonth[month-1]) {
            day = 1;
            month +=1;
        }
    }
    if(month > 12) {
        month = 1;
        year++;
    }

    return {day:day, month:month, year:year};
}

function getPreviousPalindromeDate(date) {
    var counter = 0;
    var prevDate = getPreviousDate(date);

    while(1) {
        counter +=1;
        var [isPalindromeDate, dateFormat] = checkAllFormatPalinromeDates(prevDate);

        if(isPalindromeDate) {
            break;
        }
        prevDate = getPreviousDate(prevDate);
    }

    return [counter, dateFormat, prevDate];
}

function getNextPalindromeDate(date) {
    var counter = 0;
    var nextDate = getNextDate(date);

    while(1) {
        counter +=1;
        var [isPalndromeDate, dateFormat] = checkAllFormatPalinromeDates(nextDate);

        if(isPalndromeDate) {
            break;
        }
        nextDate = getNextDate(nextDate);
    }

    return [counter, dateFormat, nextDate];
}

function showMessage(message) {
    output.innerText = message;
}

function showExtraMessage(msg) {
    output.innerText += " "+msg;
}

function checkAllFormatPalinromeDates(date) {
    var dateStr = getDateAsStr(date);
    var everyFormatDates = getEveryDateFormat(dateStr);
    var checkPalindromeResult = checkIfPalindrome(everyFormatDates);

    return checkPalindromeResult;
}

function calculateNextPalidromeDate(date) {
    var [missedByNext, dateFormat, nextDate] = getNextPalindromeDate(date);
    var [missedByPrev, dateFormat, prevDate] = getPreviousPalindromeDate(date);

    if (missedByPrev < missedByNext) {
        var palindromeDate = getDateAsStr(prevDate);
        var nearestPalindrome = [missedByPrev, dateFormat, palindromeDate];
    } else {
        var palindromeDate = getDateAsStr(nextDate);
        var nearestPalindrome = [missedByNext, dateFormat, palindromeDate]
    }

    return nearestPalindrome;
}

function clickButtonHandler() {

    if (dateInput.value !== "") {
        var dateIn = dateInput.value.split("-").reverse();
        var date = {day:Number(dateIn[0]), month:Number(dateIn[1]), year:Number(dateIn[2])};
        var [checkPalindromeResult, currentDateFormat] = checkAllFormatPalinromeDates(date);
        
        if(checkPalindromeResult) {
            showMessage(`🎉Yaay! you have a palindrome 🎂Birthday according to 📅${currentDateFormat}. Where's my 🍰treat?`);
        } else {
            showMessage("☹️Oops! your birthday is not a palindrome!!");
            var [daysCounter, dateFormat, palindromeDate ] = calculateNextPalidromeDate(date);
            showExtraMessage(`\nWell the nearest palindrome date is 📆${palindromeDate.day}-${palindromeDate.month}-${palindromeDate.year} according to 📅${dateFormat} format. You missed by just #️⃣${daysCounter} days😞`);
        }
    } else {
        showMessage("Please input date first!!");
    }
}

checkBtn.addEventListener("click", clickButtonHandler);