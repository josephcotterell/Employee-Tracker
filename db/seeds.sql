INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Manager', 100000, 1),
    ('Salesperson', 90000, 1),
    ('Lead Engineer', 300000, 2),
    ('Software Engineer', 180000, 2),
    ('Accounting Manager', 170000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 135000, 4),
    ('Solicitor', 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Paulie', 'Dickard', 1, NULL),
    ('Jack', 'Kean', 2, 1),
    ('Sally', 'Sob', 3, NULL),
    ('Larry', 'Good', 4, 3),
    ('Todd', 'Bob', 5, NULL),
    ('Alan', 'Pop', 6, 5),
    ('Tim', 'S',7 , NULL),
    ('Loll', 'Pickle', 8, 7);