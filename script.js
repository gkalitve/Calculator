let [a, op, b, input] = [``, ``, ``, ``]; 

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
        default:
            return `ENTER +, -, ×, or ÷`;
    }
}

let btn = document.querySelectorAll("button");
btn.forEach(function(i) {
    i.addEventListener(`mouseover`, () => i.classList.add("hover"));
    i.addEventListener(`mouseout`, () => i.classList.remove("press", "hover"));
    i.addEventListener(`mousedown`, () => i.classList.add("press"));
    i.addEventListener(`mouseup`, () => i.classList.remove("press"));
    i.addEventListener(`click`, function () {

    let input = this.textContent;

    // clear display and variables on button press if last input was an ERROR
    (lowerRow[0].textContent == `ERROR`) ? ([a, b, op, upperRow[0].textContent, lowerRow[0].textContent] = [``,``,``,``,``]) : [a, b, op, upperRow[0].textContent, lowerRow[0].textContent];

    switch (input) {

    // clear everything
    case (`AC`):

      [a, b, op, upperRow[0].textContent, lowerRow[0].textContent] = [``,``,``,``,``]
      break;

    // clear last figure  
    case (`C`):

        // clearing a
        if (a != `` && op == ``) {
            a = a.slice(0, a.length - 1);
            lowerRow[0].textContent = a;
            upperRow[0].textContent = ``;

        // clearing op           
        } else if (b == `` && op != ``) {
            op = ``;
            upperRow[0].textContent = a;

        // clearing b
        } else if (b != ``) {
            b = b.slice(0, b.length - 1);
            lowerRow[0].textContent = b;
        }

        break;

    default:

        // check if key pressed is number or operator
        let isNum = Array.from(Array(10).keys()).includes(Number(input));  

        // 0) ERROR message: 
        //    operator without 1st value 
        //    `=` sign without second value 
        //    division by 0
        if (((a == ``) && (isNum == false)) || ((input == `=`) && (b == ``)) || ((op == `÷`) && (b == `0`))) {
            upperRow[0].textContent = ``;
            lowerRow[0].textContent = `ERROR`;
        } 

        // 1) b not declared, op not declared, input is a number => assign to a; allows to have mutli figure a
        else if ((b == ``) && (op == ``) && (isNum == true)) { 
            a += input;
            lowerRow[0].textContent = a;
            return a;
        }

        // 2) a declared, b not declared, input is an operator => assign to op; allows to change operator
        else if ((a != ``) && (b == ``) && (isNum == false)) {    
            op = input;
            lowerRow[0].textContent = a + op;
            return op;
        }

        // 3) op declared, b not declared, input is a number => assign to b; necessary to move current line to upperRow;
        else if ((op != ``) && (b == ``) && (isNum == true)) {
            b = input;
            upperRow[0].textContent = lowerRow[0].textContent;
            lowerRow[0].textContent = b;
            return b;
        }

        // 4) op declared, b declared, input is a number => assign to b; necessary to keep b on lowerRow;
        else if ((op != ``) && (b != ``) && (isNum == true)) {
            b += input;
            lowerRow[0].textContent = b;
            return b;
        }

        // 5) b declared, input is "=" => run operate(), a = last result, op and b cleared
        else if ((b != ``) && (input == `=`)) {
            upperRow[0].textContent += lowerRow[0].textContent + input;
            lowerRow[0].textContent = operate(a, op, b);
            [a, op, b] = [lowerRow[0].textContent,``,``];
        }
        
}})
})