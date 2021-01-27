const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

// list of questions a user needs to answer for generating HTML webapage for employees

const employeeQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the person name?'
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is the persons ID number?'
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter the employees email address.'
    },
    {
        type: 'list',
        name: 'employmentType',
        message: 'Choose employment type:',
        choices: ["Manager", "Engineer", "Intern"]
    },
]

// start of the program, helps to generate the HTML file and adding the ammount of employees a user needs

function init () {
    inquirer.prompt (
        {
            type: 'list',
            name: 'addEmployee',
            message: ' Would you like to add another employee?',
            choices: ['yes', 'no']
        }
    )
    
    .then((answers) => {
        if (answers.addEmployee === 'yes') {
            chooseType ();
        }
        else {
            writeFile ();
        }
    })
    .catch (error => {
        if (error) {
            console.error (error)
        }
    })
}

// asynchronous function that waits for the user to input the ammount of people needed
// starts when the user inputs 'yes' to the function when logged into the terminal

async function writeFile () {
    let renderEmployees = await render(employees);
    fs.writeFile(outputPath, renderEmployees, function (err) {
        if (err) console.log('error', err);
    })
    console.log("You have created an HTML file!")
}

// creates seperate employment catagories through the 'lib' path based on users input in terminal

function chooseType () {
    inquirer.prompt (employeeQuestions)
    .then((answers) => {
        if (answers.employmentType === "Manager") {
            addManager (answers);
        }
        else if (answers.employmentType === "Intern") {
            addIntern (answers);
        }
        else if (answers.employmentType === "Engineer") {
            addEngineer (answers);
        }
        else {
            console.log ("error");
        }
    })
    .catch (error => {
        if (error) {
            console.error (error)
        }
    })
}

// adding each employees extra questions (office number, school and github)

function addManager (managerAnswers) {
    inquirer.prompt (
        {
            type: 'input',
            name: 'officeNumber',
            message: 'What is the managers office number?'
        },
    )

    .then (async (answer) => {
        const {name, id, email} = managerAnswers;
        let newManager = await new Manager (name, id, email, answer.officeNumber);
        employees.push (newManager);
        console.table (employees)
        init();
    })

    .catch (error => {
        if (error) {
            console.error (error)
        }
    })
}

function addIntern (internAnswers) {
    inquirer.prompt (
        {
            type: 'input',
            name: 'school',
            message: 'What school do they attend?'
        },
    )

    .then (async (answer) => {
        const {name, id, email} = internAnswers;
        let newIntern = await new Intern (name, id, email, answer.school);
        employees.push (newIntern);
        console.table (employees);
        init();
    })

    .catch (error => {
        if (error) {
            comsole.error (error)
        }
    })
}

function addEngineer (engineerAnswers) {
    inquirer.prompt (
        {
            type: 'input',
            name: 'github',
            message: 'What is their GitHub info?'
        },
    )

    .then (async (answer) => {
        const {name, id, email} = engineerAnswers;
        let newEngineer = await new Engineer (name, id, email, answer.github);
        employees.push (newEngineer);
        console.table (employees);
        init();
    })

    .catch (error => {
        if (error) {
            console.error (error)
        }
    })
}

init();