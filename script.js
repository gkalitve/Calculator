let [a, op, b, input, result] = [``, ``, ``, ``, ``];   

let upperRow = document.getElementsByClassName("upperRow");

let lowerRow = document.getElementsByClassName("lowerRow");

let add = (a, b) => (Number(a) + Number(b));

let sub = (a, b) => (a - b);

let mul = (a, b) => (a * b);

let div = (a, b) => (a / b);

function operate () {
    switch (op) {
        case `+`:
            return (add(a, b));
        case `-`:
            return (sub(a, b));
        case `×`:
            return (mul(a, b));
        case `÷`:
            return (div(a, b));
    }
}

function variable (x, input) { 
    
    // x is less than 9 chars (allows to extend x up to 9 chars), do the following
    if (x.length < 9) {

        // if x has decimal places, ignore `.` input, otherwise add input   
        if ((x.toString().includes(`.`))) {(input == `.`)?   x   :   (x += input);}

        // if first input is `.` make it `0.` 
        else if ((x === ``) && (input == `.`)) {x = `0.`} 

        // otherwise keep adding input to x
        else { x += input }                               
    }

    // assign x to string lowerRow   
    lowerRow[0].textContent = x;
    return x;
}

function round (decimal) {   
    // slice off characters beyond 9th and use toFixed method to round up 9th digit
    decimal = +decimal;
    decimal = +decimal.toFixed((decimal.toString().slice(0, 9).length - (decimal.toString().indexOf(`.`) + 1)));
    return decimal;
}   

let btn = document.querySelectorAll("button");
btn.forEach(function(i) {
    i.addEventListener(`mouseover`, () => i.classList.add("hover"));
    i.addEventListener(`mouseout`, () => i.classList.remove("press", "hover"));
    i.addEventListener(`mousedown`, () => i.classList.add("press"));
    i.addEventListener(`mouseup`, () => i.classList.remove("press"));
    i.addEventListener(`click`, function () {

    let input = this.textContent;

    // clear display and variables on button press if last input was an ERROR message
    if ((lowerRow[0].textContent == `ERROR`) || (lowerRow[0].textContent == `VALUE`) || (lowerRow[0].textContent == `RESULT`)) {
        [a, b, op, upperRow[0].textContent, lowerRow[0].textContent, input, result] = [``,``,``,``,``,``,``]

    } else {

    switch (input) {

        // clear everything
        case (`AC`):

        [a, b, op, upperRow[0].textContent, lowerRow[0].textContent, input, result] = [``,``,``,``,``,``,``]
        break;

        // clear last figure  
        case (`C`):

            // clearing a
            if (a !== `` && op == ``) {
                a = a.toString().slice(0, a.toString().length - 1);
                lowerRow[0].textContent = a;
                // clearing out upperRow equation if a is being modified    
                upperRow[0].textContent = ``;

            // clearing op           
            } else if (b === `` && op !== ``) {
                op = ``;
                lowerRow[0].textContent = a;

            // clearing b
            } else if (b !== ``) {
                b = b.slice(0, b.length - 1);
                lowerRow[0].textContent = b;
            }

        break;

        default:

            // check if key pressed is number or operator
            let isNum = Array.from(Array(10).keys()).includes(Number(input)); 

            // ERROR CASE operator without 1st value 
            if (((a === ``) && (isNum == false) && (input != `.`))) {
                upperRow[0].textContent = `ERROR, INPUT FIRST`;
                lowerRow[0].textContent = `VALUE`;
            } 

            // ERROR CASE `=` sign without second value 
            if (((input == `=`) && (b === ``))) {
                upperRow[0].textContent = `ERROR, INPUT SECOND`;
                lowerRow[0].textContent = `VALUE`;
            } 

            // CASE a
            // no result displayed, b not declared, op not declared, input is a number => assign to a; allows to have multi figure a
            else if ((b === ``) && (op === ``) && (isNum == true || input == `.`)) { 
            a = variable (a, input);
            }
            

            // CASE op
            // a declared, b not declared, input is an operator => assign to op; allows to change operator
            else if ((a !== ``) && (b === ``) && (isNum == false) && (input != `.`)) {    

                op = input;

                // converting string a to number, adding op and converting to string loweRow
                lowerRow[0].textContent = Number(a) + op;
                return op;
            }


            // CASE b
            // op declared, b not declared, input is a number => assign to b; necessary to move current line to upperRow;
            else if ((op !== ``) && (isNum == true || input == `.`)) {

                // check if b is 1st character
                if (b === ``)  {
                
                    // move what's on the lowerRow to upperRow, assign b to lowerRow
                    upperRow[0].textContent = lowerRow[0].textContent;
                    lowerRow[0].textContent = b;
                } 
                b = variable (b, input);
            }
            

            // CASE result
            else if ((b !== ``)) {

                // converting string b to number to remove trailing "0"
                b = Number(b);

                // adding b and "=" to upperRow string
                upperRow[0].textContent += (b + "=");

                // performing the calculation
                result = (operate(a, op, b));

                    // `CAN'T FIT` if result is integer and has too many digits
                    if ((result.toString().length > 9) && !(result.toString().includes(`.`))) {
                        upperRow[0].textContent = `CANNOT DISPLAY`;
                        lowerRow[0].textContent = `RESULT`;
                    }   
                        
                    // `CAN'T FIT` if result has fractional component and has too many digits
                    else if ((result.toString().length > 9) && (result.toString().indexOf(`.`)) > 7) {
                        upperRow[0].textContent = `CANNOT DISPLAY`;
                        lowerRow[0].textContent = `RESULT`;
                    }   

                    // ERROR if result is inifinity
                     else if (result == Infinity) {
                        upperRow[0].textContent = ``;
                        lowerRow[0].textContent = `ERROR`;
                    }

                     else {
                        // round up if decimal
                        result.toString().includes(`.`) 
                        ? result = round(result)
                        : result;

                        // if input "=" display result as normal and assign result to a;
                        // if input is "*", "/", "+", or "-", display result, assign result to a, input to op and prepare for input of b for next operation
                        input == `=`
                        ? [a, op, b, lowerRow[0].textContent] = [result,``,``, result]
                        : [a, op, b, lowerRow[0].textContent] = [result, input,``, result + input]

                    }
            }
    }}})
})