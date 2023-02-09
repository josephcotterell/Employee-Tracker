const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

const connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: `root`,
  database: "employee_db",
});

connect.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connect.threadId}`);
  EmployeePrompt();
});

//employees
const EmployeePrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Select an option.",
        choices: [
          "View All Employees",
          "View All Departments",
          "View All Roles",
          "Add Department",
          "Add Role",
          "Add Employee",
          "update Employee Role",
          "Exit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.choice) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "update Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          connect.end();
          break;
      }
    });
};
const viewAllDepartments = () => {
  console.log("All departments");
  const mysql = `SELECT department.id, department.name as department FROM department`;

  connect.query(mysql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    EmployeePrompt();
  });
};

//roles
const viewAllRoles = () => {
  console.log("All roles");
  const mysql = `SELECT role.id, role.title, role.salary, department.name as department FROM role LEFT JOIN department ON role.department_id = department.id`;

  connect.query(mysql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    EmployeePrompt();
  });
};
//add department
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      const mysql = `INSERT INTO department (name) VALUES (?)`;
      connect.query(mysql, answer.name, (err, result) => {
        if (err) throw err;
        console.log("Added" + answer.name + "to departments");
        viewAllDepartments();
      });
    });
};
//add role function
addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
    ])
    .then((answer) => {
      const params = [answer.title, answer.salary];
      const roles = `SELECT name, id FROM department`;

      connect.query(roles, (err, data) => {
        if (err) throw err;
        const department_const = data.map(({ name, id }) => ({
          name: name,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "department_const",
              message: "Which department does this role belong to?",
              choices: department_const,
            },
          ])
          .then((departments_constChoice) => {
            const department_id = departments_constChoice.department_const;
            params.push(department_id);
            const mysql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            console.log(mysql, params);
            connect.query(mysql, params, (err, result) => {
              if (err) throw err;
              console.log("Added" + answer.roles + "to roles");
              viewAllRoles();
            });
          });
      });
    });
};
//add employees function
addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the first name of the employee?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the last name of the employee?",
      },
    ])
    .then((answer) => {
      const params = [answer.first_name, answer.last_name];
      const roles_const = `SELECT role.id, role.title FROM role`;

      connect.query(roles_const, (err, data) => {
        if (err) throw err;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((rolesChoice) => {
            const roles = rolesChoice.roles;
            params.push(roles);
            const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`;

            connect.query(sql, params, (err, data) => {
              if (err) throw err;
              console.log("Employee added successfully.");
              viewAllEmployees();
            });
          });
      });
    });
};

//update employee
updateEmployeeRole = () => {
  const employeesql = `SELECT * FROM employee`;

  connect.query(employeesql, (err, data) => {
    if (err) throw err;
    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee do you want to update?",
          choices: employees,
        },
      ])
      .then((answer) => {
        const employee = answer.employee;
        const rolesql = `SELECT * FROM role`;

        connect.query(rolesql, (err, data) => {
          if (err) throw err;
          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "What is the employee's new role?",
                choices: roles,
              },
            ])
            .then((rolesChoice) => {
              const role = rolesChoice.role;
              const employeesql = `SELECT * FROM employee`;

              connect.query(employeesql, (err, data) => {
                if (err) throw err;
                const employees = data.map(({ id, first_name, last_name }) => ({
                  name: first_name + " " + last_name,
                  value: id,
                }));
                const managerChoices = employees.concat([
                  { name: "None", value: null },
                ]);
                inquirer
                  .prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Who is the employee's new manager?",
                      choices: managerChoices,
                    },
                  ])
                  .then((managerChoice) => {
                    const manager = managerChoice.manager;
                    connect.query(
                      `UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?`,
                      [role, manager, employee],
                      (err, result) => {
                        if (err) throw err;
                        viewAllEmployees();
                      }
                    );
                  });
              });
            });
        });
      });
  });
};
