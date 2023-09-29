import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer"

const salt = 10;

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "inventory-system"
})

app.post('/validateEmail', (req, res) => {
    const sql = 'SELECT * FROM `accounts` WHERE `email` = ?';
    db.query(sql, [req.body.email], (err, result) => {
        if (err) {
            return res.json({ error: "Error error!" });
        }
        if (result.length > 0) {
            return res.json({ message: "Email exists!" });
        } else {
            return res.json({ message: "Success" });
        }
    });
});

app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) {
            return res.json({ error: "Error for hashing password!" });
        }
        // return res.json({ message: "Success" });
        db.query('INSERT INTO `accounts`(`firstName`, `lastName`, `email`, `password`, `time`, `date`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?)', [ req.body.firstName, req.body.lastName, req.body.email, hash, time(), date(), "Not Verified" ], (error, result) => {
            if (error) {
                return res.json({ error: "Error while inserting account to database!" });
            }
            console.log('Table created successfully');
            // Array of SQL queries to create tables
            const createTableQueries = [
                // ... Your create table queries here
                `
                CREATE TABLE IF NOT EXISTS deleted_stocks (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    account_id INT (100),
                    barcode_id VARCHAR(255),
                    product_name VARCHAR(255),
                    quantity INT (100),
                    price DOUBLE,
                    total_price DOUBLE,
                    date_stock_in VARCHAR(255),
                    date_expired VARCHAR(255)
                )
                `,
                `
                CREATE TABLE IF NOT EXISTS history (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    account_id INT (100),
                    message VARCHAR(255),
                    time VARCHAR(255),
                    date VARCHAR(255)
                )
                `,
                `
                CREATE TABLE IF NOT EXISTS cash (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    account_id INT (100),
                    cash DOUBLE,
                    cashTime VARCHAR(255),
                    cashDate VARCHAR(255)
                )
                `,
                `
                CREATE TABLE IF NOT EXISTS stocks (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    account_id INT (100),
                    barcode_id VARCHAR(255),
                    product_name VARCHAR(255),
                    quantity INT (100),
                    price DOUBLE,
                    total_price DOUBLE,
                    date_stock_in VARCHAR(255),
                    date_expired VARCHAR(255)
                )
                `,
                ` 
                CREATE TABLE IF NOT EXISTS item_bought (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY ,
                    account_id INT (100) ,
                    product_id INT (100),
                    productIndex INT (100),
                    product_name VARCHAR(255),
                    quantity INT (100),
                    price DOUBLE,
                    date_bought VARCHAR(255) 
                )
                `,
                ` 
                CREATE TABLE IF NOT EXISTS payment_history (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    account_id INT (100) ,
                    total_price DOUBLE,
                    payment_date VARCHAR(255)
                )
                `,
                ` 
                CREATE TABLE IF NOT EXISTS cash_in_out_history (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    account_id INT (100),
                    message VARCHAR(255),
                    amount DOUBLE,
                    payment_time VARCHAR(255),
                    payment_date VARCHAR(255),
                    track VARCHAR (255)
                )
                `,` 
                CREATE TABLE IF NOT EXISTS contact (
                    id INT(100) AUTO_INCREMENT PRIMARY KEY,
                    email VARCHAR(255),
                    message VARCHAR(255),
                    time VARCHAR(255),
                    date VARCHAR(255)
                )
                `,
            ];

            // Execute each query
            let errorOccurred = false;

            createTableQueries.forEach((query, index) => {
                db.query(query, (err, result) => {
                    if (err) {
                        errorOccurred = true;
                        console.error(`Error creating table${index + 1}:`, err);
                    }

                    // Check if this is the last query
                    if (index === createTableQueries.length - 1) {
                        if (errorOccurred) {
                            return res.json({ error: "Error while creating tables!" });
                        }

                        return res.json({ message: "Success" });
                    }
                });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM `accounts` WHERE `email` = ?'

    db.query(sql, [ req.body.email ], (err, data) => {

        if (err) return res.json({ error: "Error while fetching!" })

        if (data.length > 0) {
            if (data[0].status === "Not Verified") return res.json({ message: "Your account is not yet verified by the Developer!" })

            bcrypt.compare( req.body.password.toString(), data[0].password, (err, result) => {
                if (err) return res.json({ error: "Server Side Error!"})

                if (result) {
                    const firstName = data[0].firstName
                    const lastName = data[0].lastName
                    const id = data[0].id
                    const token = jwt.sign({ firstName, lastName, id }, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token, { httpOnly: true, secure: true });
                    return res.json({ message: "Success", id, firstName, lastName })
                } else return res.json({ error: "Password not matched!" })
            })
        } 
        
        else return res.json({ error: "No email exist!" })
    })
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.json({ error: "You are not yet log in" })

    else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) return res.json({ error: "Token is not correct!" })

            // else {
                req.firstName = decoded.firstName;
                req.lastName = decoded.lastName;
                req.id = decoded.id
                next();
            // }
        })
    }
}

app.get('/', verifyUser ,(req, res) => {
    return res.json({ message: "Success", firstName: req.firstName, lastName: req.lastName, id: req.id })
})

app.post('/contact', (req, res) => {
    const email = req.body.email
    const message = req.body.message

    const createTableQueries = [
        ` 
        CREATE TABLE IF NOT EXISTS contact (
            id INT(100) AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255),
            message VARCHAR(255),
            time VARCHAR(255),
            date VARCHAR(255)
        )
        `,
    ];

    // Execute each query
    let errorOccurred = false;

    createTableQueries.forEach((query, index) => {
        db.query(query, (err, result) => {
            if (err) {
                errorOccurred = true;
                console.error(`Error creating table${index + 1}:`, err);
            }

            // Check if this is the last query
            if (index === createTableQueries.length - 1) {
                if (errorOccurred) {
                    return res.json({ error: "Error while creating tables!" });
                }

                db.query('INSERT INTO `contact`(`email`, `message`, `time`, `date`) VALUES ( ?, ?, ?, ? )', [ email, message, time(), date() ], (err, result) => {
                    if (err) return res.json({ error: "Error occured"})
            
                    return res.json({ message: "Success"})
                })
            }
        });
    });
})

app.get('/forgotPassword', (req, res) => {
    const  email = req.query.email
    db.query('SELECT * FROM `accounts` WHERE `email` = ?', [ email ], (err, result) => {
        if (err) return res.json({ error: "Error occured" })

        if (result.length === 0) return res.json({ message: "Email not found" })

        const token = jwt.sign({ id: result[0].id}, "jwt_secret_key", { expiresIn: "15m" })

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'masterlonglongdeveloper@gmail.com',
              pass: 'yltmarungqjegoae'
            }
        });
          
        var mailOptions = {
            from: 'youremail@gmail.com',
            to: `${email}`,
            subject: 'Reset Your Password!',
            text: `This link is valid for 15 minutes only. Make sure you reset your password before it expired. DONT SHARE THIS TO OTHERS!.
                    This message is from MASTER LONGLONG DEVELOPER http://localhost:3000/resetpassword/${result[0].id}/${token}`
        };
          
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return res.json({ message: "Success" })
            }
        });
    })
})

app.put('/resetpassword/:accountId/:token', (req, res) => {
    const { accountId, token } = req.params
    const { password } = req.body

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if (err) return res.json({ erro: "Error occured" })

        const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
        if (decoded.exp && decoded.exp < currentTimestamp) {
            return res.json({ message: "Token has expired" });
        }
        
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return res.json({ error: "Error for hashing password!" });
            }

            db.query('UPDATE `accounts` SET `password`= ? WHERE `id` = ?', [ hash, accountId ], (err, result) => {
                if (err) return res.json({ error: "Error occured!" })

                return res.json({ message: "Success" })
            })
        })
    })
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: "Success" })
})

app.get('/getStock/:id', (req, res) => {
    const id = req.params.id
    db.query(`SELECT * FROM stocks WHERE id = ?`, [id], (err, result) => {
        if (err) return res.json({ error: "Error while fetching the single data!" })
        if (result.length === 0) return

        return res.json({ data: result, message: "Success" })
    })
})

app.put('/updateStock/:accountId/:id', (req, res) => {
    const id = req.params.id
    const accountId = req.params.accountId
    db.query(`UPDATE stocks SET barcode_id= ?, product_name= ?, quantity= ?, price= ?, total_price= ?, date_stock_in= ?,date_expired= ? WHERE account_id = ? AND id = ?`, [req.body.barcode, req.body.productName, req.body.productQuantity, req.body.productPrice,  req.body.totalPrice, req.body.dateStockIn, req.body.dateExpired, accountId, id ], (err, data) => {
        if (err) return res.json({ error: "Error while udpating the stocks!" })

        return res.json({ message: "Success" })
    })
})

app.delete('/deletedStock/:accountId/:id', (req, res) => {
    const accountId = req.params.accountId
    const id = req.params.id

    db.query(`DELETE FROM stocks WHERE id = ? AND account_id = ?`, [id, accountId], (err, data) => {
        if (err) return res.json({ error: "Error while deleting stock!" })
        return res.json({ message: "Success" })
    })
})

app.post('/deleteStock/:accountId', (req, res) => {
    const accountId = req.params.accountId
    const sql = `INSERT INTO deleted_stocks(account_id, barcode_id, product_name, quantity, price, total_price, date_stock_in, date_expired) VALUES (? ,? ,? ,? ,? ,? ,? ,? )`
    db.query(sql, [ accountId, req.body.barcode, req.body.productName, req.body.productQuantity, req.body.productPrice, req.body.totalPrice, req.body.dateStockIn, req.body.dateExpired ], (err, data) => {
        if (err){
            console.log(err)
            return res.json({ error: "Error while inserting deleted stock to deleted_stocks table!" })
        }
        return res.json({ message: "Success" })
    })
})

app.post('/history', (req, res) => {
    const sql = `INSERT INTO history(account_id, message, time, date) VALUES ( ?, ?, ?, ?)`
    db.query(sql, [ req.body.id, req.body.message, time(), date()], (err, data) => {
        if (err) return res.json({ error: "Error while inserting data to history!" })

        return res.json({ message: "Success" })
    })
})

app.post('/addStock/:id', (req, res) => {
    const id = req.params.id
    const sql = `INSERT INTO stocks (account_id, barcode_id, product_name, quantity, price, total_price, date_stock_in, date_expired) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`
    db.query(sql, [ id, req.body.barcode, req.body.productName, req.body.productQuantity, req.body.productPrice, req.body.totalPrice, req.body.dateStockIn, req.body.dateExpired ], (err, data) =>{
        if (err){
            console.log(err)
            return res.json({ error: "Error while adding stock to the table!" })
        } 

        return res.json({ message: "Success" })
    })
})

app.get('/amountLoss/:id', (req, res) => {
    const id = req.params.id
    db.query(`SELECT * FROM stocks WHERE account_id = ?`, [id], (err, result) => {
        if (err) return res.json({ error: 'Error while fetching the stocks!' })

        if (result.length === 0) return
        
        return res.json({ data: result, message: "Success" })
    })
})

app.get('/totalExpired/:id', (req, res) => {
    const id = req.params.id
    db.query(`SELECT * FROM stocks WHERE account_id = ?`, [id], (err, result) => {
        if (err) return res.json({ error: 'Error while fetching the stocks!' })

        if (result.length === 0) return

        return res.json({ data: result, message: "Success" })
    })
})

app.get('/totalCash/:id', (req, res) => {
    const id = req.params.id
    let totalCash = 0

    db.query('SELECT * FROM `cash` WHERE `account_id` = ?', [ id ], (err, results) => {
        if (err) return res.json({ error: "Error" })

        for (const row of results) {
            totalCash = totalCash + row.cash
        }

        return res.json({ amount: totalCash, message: "Success" })
    })
})

app.get('/totalOutOfStocks/:id', (req, res) => {
    const id = req.params.id
    db.query(`SELECT * FROM stocks WHERE account_id = ?`, [id], (err, result) => {
        if (err) return res.json({ error: 'Error while fetching the stocks!' });

        if (result.length === 0) return

        return res.json({ data: result, message: "Success" })
    });
})

app.get('/totalStocks/:id', (req, res) => {
    const id = req.params.id

    db.query(`SELECT * FROM stocks WHERE account_id = ?`, [id], (err, result) => {
        if (err) return res.json({ error: 'Error while fetching the stocks!' });

        if (result.length === 0) return

        return res.json({ data: result, message: "Success" })
    });
})

app.post('/item_bought', (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid data' });
    }
      
    const insertQueries = products.map((product) => {
        return db.query('INSERT INTO item_bought SET ?', product);
    });
    
      // Execute all insert queries
    Promise.all(insertQueries)
    .then(() => {
        return res.json({ message: 'Success' });
    })
    .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'Error saving products' });
    });
});
    

app.get('/dashboard', (req, res) => {
    const page = req.query.page || 1;
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const search = req.query.search || '';
    const searchQuery = '%' + search + '%';
    const id = req.query.id;
    
    db.query(
        'SELECT * FROM stocks WHERE account_id = ? LIMIT ?, ?', [id, startIndex, perPage], (err, result) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.json({ error: 'Error something happened on the server side!' });
        }

        if (result.length === 0) return res.json({ message: "Empty" })

            db.query(`SELECT COUNT(*) as totalCount FROM stocks WHERE account_id = ? AND product_name LIKE ?`, [id, searchQuery], (error, countResult) => {
                if (error) {
                    console.log('Error fetching total count: ', error);
                    res.json({ error: 'An error occurred' });
                }

                const total = countResult[0].totalCount
                const totalCount = countResult[0].totalCount;
                const totalPages = Math.ceil(totalCount / perPage);

                return res.json({ data: result, message: "Success", total, totalPages })
            });
        }
    );
});

app.get('/stocks', (req, res) => {
    const page = 1;
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const search = req.query.search || '';
    const searchQuery = '%' + search + '%';
    const id = req.query.id;
  
    db.query(
      'SELECT * FROM stocks WHERE account_id = ? AND ( quantity >= 1 AND ( barcode_id LIKE ? OR product_name LIKE ? )) LIMIT ?, ?', [id, searchQuery, searchQuery, startIndex, perPage], (err, result) => {
        if (err) {
          console.error('Error executing database query:', err);
          return res.json({ error: 'Error something happened on the server side!' });
        }
  
        if (result.length === 0) {
          return res.json({ data: [], message: 'Success' }); // Return an empty array if no data matches the criteria.
        }
  
        const currentDate = new Date();
  
        // Use filter to remove data where diffDay <= 0
        const filteredResult = result.filter((data) => {
            const dateParts = data.date_expired.split('-');
            const inputDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);
    
            const diffTime = inputDate - currentDate;
            const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
            return diffDay > 0; // Keep data where diffDay is greater than 0
        });
  
        return res.json({ data: filteredResult, message: 'Success' });
    });
});

app.post('/item_bought_cash/:accountId', (req, res) => {
    const accountId = req.params.accountId
    const amount = req.body.total 
    let totalAmount = 0

    db.query('SELECT * FROM `cash` WHERE `account_id` = ?', [ accountId ], (err, results) => {
        if (err) return res.json({ error: "Error" })

        if (results.length === 0) {
            db.query('INSERT INTO `cash`(`account_id`, `cash`, `cashTime`, `cashDate`) VALUES ( ?, ?, ?, ?)', [ accountId, amount, time(), date() ], (err, results) => {
                if (err) return res.json({ error: "Error!" })
        
                return res.json({ message: "Success" })
            })
        }

        for (const row of results) {
            totalAmount = totalAmount + row.cash
        }

        totalAmount = totalAmount + amount

        db.query('UPDATE `cash` SET `cash`= ?, `cashTime`= ?, `cashDate`= ?  WHERE `account_id` = ?', [ totalAmount, time(), date(), accountId ], (err, results) => {
            if (err) return res.json()

            return res.json({ message: "Success" })
        })
    })
    
})

app.put('/updateProductBought', (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    const insertQueries = products.map((product) => {
        return db.query('UPDATE `stocks` SET `quantity`= `quantity` - ?, `total_price` = `price` * `quantity`  WHERE `account_id` = ? AND `id` = ?', [ product.quantity, product.account_id, product.product_id ]);
    });
      // Execute all insert queries
    Promise.all(insertQueries)
    .then(() => {
        return res.json({ message: 'Success' });
    }).catch((err) => {

        console.error(err);

        return res.status(500).json({ error: 'Error saving products' });

    });

})

app.post('/cashIn/:accountId', (req, res) => {

    const accountId = req.params.accountId
    const amount = req.body.amount 
    let totalAmount = 0

    db.query('SELECT * FROM `cash` WHERE `account_id` = ?', [ accountId ], (err, results) => {
        if (err) return res.json({ error: "Error" })

        if (results.length === 0) {
            db.query('INSERT INTO `cash`(`account_id`, `cash`, `cashTime`, `cashDate`) VALUES ( ?, ?, ?, ?)', [ accountId, amount, time(), date() ], (err, results) => {
                if (err) return res.json({ error: "Error!" })
        
                return res.json({ message: "Success" })
            })
        } else {
            totalAmount = parseFloat(results[0].cash) + parseFloat(amount)

            if (parseFloat(amount) >= 1) {
                db.query('UPDATE `cash` SET `cash`= ?, `cashTime`= ?, `cashDate`= ?  WHERE `account_id` = ?', [ totalAmount, time(), date(), accountId ], (err, results) => {
                    if (err) return res.json()
        
                    return res.json({ message: "Success" })
                })
            } else {
                return res.json({ message: "Below" })
            }
        }
    })
    
})

app.post('/cashInHistory/:accountId', (req, res) => {
    const accountId = req.params.accountId 
    const amount = req.body.amount
    const message = `You have cash in successfully!`
    db.query('INSERT INTO `cash_in_out_history`(`account_id`, `message`, `amount`, `payment_time`, `payment_date`, `track`) VALUES ( ?, ?, ?, ?, ?, ?)', [ accountId, message, amount, time(), date(), "Cash In" ], (err, result) => {
        if (err) return res.json({ err: "Error" })

        return res.json({ message: "Success" })
    })
})

app.post('/cashOut/:accountId', (req, res) => {
    const accountId = req.params.accountId 
    const amount = req.body.amount 

    db.query('SELECT * FROM `cash` WHERE `account_id` = ?', [ accountId ], (err, results) => {
        if (err) return res.json({ error: "Error" })

        if (results.length === 0) {
            db.query('INSERT INTO `cash`(`account_id`, `cash`, `cashTime`, `cashDate`) VALUES ( ?, ?, ?, ?)', [ accountId, amount, time(), date() ], (err, results) => {
                if (err) return res.json({ error: "Error!" })
        
                return res.json({ message: "Success" })
            })
        }

        if (parseFloat(results[0].cash) >= parseFloat(amount) && parseFloat(amount) > 0) {
            const totalAmount = parseFloat(results[0].cash) - parseFloat(amount)

            db.query('UPDATE `cash` SET `cash`= ?, `cashTime`= ?, `cashDate`= ?  WHERE `account_id` = ?', [ totalAmount, time(), date(), accountId ], (err, results) => {
                if (err) return res.json()
    
                return res.json({ message: "Success" })
            })
        } else {
            return res.json({ message: "Not enough" })
        }       
    })
})

app.post('/cashOutHistory/:accountId', (req, res) => {
    const accountId = req.params.accountId 
    const amount = req.body.amount
    const message = `You have cash out successfully!`
    db.query('INSERT INTO `cash_in_out_history`(`account_id`, `message`, `amount`, `payment_time`, `payment_date`, `track`) VALUES ( ?, ?, ?, ?, ?, ?)', [ accountId, message, amount, time(), date(), "Cash Out" ], (err, result) => {
        if (err) return res.json({ err: "Error" })

        return res.json({ message: "Success" })
    })
})

app.get('/cashInOutHistory', (req, res) => {
    const page = req.query.currentPage || 1;
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const id = req.query.accountId;
    
    db.query(
        'SELECT * FROM `cash_in_out_history` WHERE `account_id` = ? ORDER BY `id` DESC LIMIT ?, ?', [id, startIndex, perPage], (err, result) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.json({ error: 'Error something happened on the server side!' });
        }

        if (result.length === 0) return res.json({ message: "Empty" })

        // return res.json({ data: result, message: "Success" })
            db.query(`SELECT COUNT(*) as totalCount FROM cash_in_out_history WHERE account_id = ? `, [id], (error, countResult) => {
                if (error) {
                    console.log('Error fetching total count: ', error);
                    res.json({ error: 'An error occurred' });
                }

                const totalCount = countResult[0].totalCount;
                const totalPages = Math.ceil(totalCount / perPage);

                return res.json({ data: result, message: "Success", totalPages })
            });
        }
    );
})

app.get('/cashInHistoryOnly', (req, res) => {
    const page = req.query.currentPage || 1;
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const id = req.query.accountId;
    const cashIn = "Cash In"

    db.query(
        'SELECT * FROM `cash_in_out_history` WHERE `account_id` = ? AND `track` = ? ORDER BY `id` DESC LIMIT ?, ? ', [id, cashIn, startIndex, perPage], (err, result) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.json({ error: 'Error something happened on the server side!' });
        }

        if (result.length === 0) return res.json({ message: "Empty" })

        // return res.json({ data: result, message: "Success" })
            db.query(`SELECT COUNT(*) as totalCount FROM cash_in_out_history WHERE account_id = ? AND track = ?`, [id, cashIn], (error, countResult) => {
                if (error) {
                    console.log('Error fetching total count: ', error);
                    res.json({ error: 'An error occurred' });
                }


                const totalCount = countResult[0].totalCount;
                const totalPages = Math.ceil(totalCount / perPage);

                return res.json({ data: result, message: "Success", totalPages })
            });
        }
    );
})

app.get('/cashOutHistoryOnly', (req, res) => {
    const page = req.query.currentPage || 1;
    const perPage = 10;
    const startIndex = (page - 1) * perPage;
    const id = req.query.accountId;
    const cashOut = "Cash Out"
    
    db.query(
        'SELECT * FROM `cash_in_out_history` WHERE `account_id` = ? AND `track` = ? ORDER BY `id` DESC LIMIT ?, ?', [id, cashOut, startIndex, perPage], (err, result) => {
        if (err) {
            console.error('Error executing database query:', err);
            return res.json({ error: 'Error something happened on the server side!' });
        }

        if (result.length === 0) return res.json({ message: "Empty" })

        // return res.json({ data: result, message: "Success" })
            db.query(`SELECT COUNT(*) as totalCount FROM cash_in_out_history WHERE account_id = ? AND track = ?`, [id, cashOut], (error, countResult) => {
                if (error) {
                    console.log('Error fetching total count: ', error);
                    res.json({ error: 'An error occurred' });
                }

                const totalCount = countResult[0].totalCount;
                const totalPages = Math.ceil(totalCount / perPage);

                return res.json({ data: result, message: "Success", totalPages })
            });
        }
    );
})

app.get('/allReportHistory', (req, res) => {

    const accountId = req.query.accountId
    const page = req.query.currentPage || 1
    const perPage = 10
    const startIndex = (page - 1) * perPage

    let amount = 0
    let products = 0

    db.query('SELECT * FROM `item_bought` WHERE `account_id` = ? ', [accountId], (err, result) => {
        if (err) return res.json({ error: "Error occured" })

        for (const data of result) {
            amount = amount + data.price
            products = products + data.quantity
        }

        db.query('SELECT * FROM `item_bought` WHERE `account_id` = ? ORDER BY `id` DESC LIMIT ?, ?', [accountId, startIndex, perPage], (err, results) => {
            if (err) return res.json({ error: "Error" })
    
            // if (results.length === 0) return res.json({ message: "Empty" })
    
            db.query(`SELECT COUNT(*) as totalCount FROM item_bought WHERE account_id = ? `, [accountId], (error, countResult) => {
                if (error) {
                    console.log('Error fetching total count: ', error);
                    res.json({ error: 'An error occurred' });
                }
    
                const totalCount = countResult[0].totalCount;
                const totalPages = Math.ceil(totalCount / perPage);
    
                return res.json({ data: results, message: "Success", totalPages, amount, products })
            });
        })
    })
})

app.get('/reportsHistory', (req, res) => {
    const accountId = req.query.accountId
    const page = req.query.currentPage || 1;
    const perPage = 10
    const startIndex = (page - 1) * perPage;
    const firstDate = date1(req.query.firstDate);
    const secondDate = date2(req.query.secondDate);

    let amount = 0;
    let products = 0;

    db.query('SELECT * FROM `item_bought` WHERE `account_id` = ? AND `date_bought` BETWEEN ? AND ? ', [accountId, firstDate, secondDate], (err, result) => {
        if (err) return res.json({ error: "Error occured" })

        for (const data of result) {
            amount = amount + data.price
            products = products + data.quantity
        }

        db.query('SELECT * FROM `item_bought` WHERE `account_id` = ? AND `date_bought` BETWEEN ? AND ? LIMIT ?, ?', [accountId, firstDate, secondDate, startIndex, perPage], (err, results) => {
            if (err) return res.json({ error: "Error" })
    
            // if (results.length === 0) return res.json({ message: "Empty" })
    
            db.query(`SELECT COUNT(*) as totalCount FROM item_bought WHERE account_id = ? `, [accountId], (error, countResult) => {
                if (error) {
                    console.log('Error fetching total count: ', error);
                    res.json({ error: 'An error occurred' });
                }
    
                const totalCount = countResult[0].totalCount;
                const totalPages = Math.ceil(totalCount / perPage);
    
                return res.json({ data: results, message: "Success", totalPages, amount, products })
            });
        })
    })
})

app.get('/allHistory', (req, res) => {
    const accountId = req.query.accountId
    const page = req.query.currentPage || ''
    const perPage = 10
    const startIndex = (page - 1) * perPage

    db.query('SELECT * FROM `history` WHERE `account_id` = ? ORDER BY `id` DESC LIMIT ?, ?', [accountId, startIndex, perPage], (err, results) => {
        if (err) return res.json({ error: "Error occured" })

        if (results.length === 0) return res.json({ message: "Empty" })

        db.query(`SELECT COUNT(*) as totalCount FROM history WHERE account_id = ? `, [accountId], (error, countResult) => {
            if (error) {
                console.log('Error fetching total count: ', error);
                res.json({ error: 'An error occurred' });
            }

            const totalCount = countResult[0].totalCount;
            const totalPages = Math.ceil(totalCount / perPage);

            return res.json({ data: results, message: "Success", totalPages })
        });
    })
})

const date1 = (firstDate) => {
    const dateParts = firstDate.split('-'); // Use '-' as the delimiter for MM-DD-YYYY
    const month = dateParts[1]
    const day = dateParts[2]
    const year = dateParts[0]
        
    return month + '/' + day + '/' + year
}

const date2 = (secondDate) => {
    const dateParts = secondDate.split('-'); // Use '-' as the delimiter for MM-DD-YYYY
    const month = dateParts[1]
    const day = dateParts[2]
    const year = dateParts[0]


    return month + '/' + day + '/' + year
}

const date = () => {
    const date = new Date();
    // Format the date as MM-DD-YYYY
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate
}

const time = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // Format the hours, minutes, and seconds to the desired format
    
    const formattedTime = `${hours}:${minutes}`;
    // Add the AM/PM suffix to the formatted time
    const formattedTimeWithSuffix = `${hours < 12 ? `${formattedTime} AM` : `${formattedTime} PM`}`;
    return formattedTimeWithSuffix
}
// db.query(
    //     `SELECT * FROM stocks WHERE account_id = ?, product_name = ? LIMIT ?, ?`,
    //     [id, searchQuery, startIndex, perPage],
    //     (err, results) => {
    //         if (err) {
    //             console.error('Error fetching items: ', err);
    //             return res.json({ error: 'An error occurred while fetching items.' });
    //         }

    //         if (results <= 0) return;

    //         db.query(`SELECT COUNT(*) as totalCount FROM stocks WHERE account_id = ?, product_name LIKE ?`, [id, searchQuery], (error, countResult) => {
    //             if (error) {
    //                 console.log('Error fetching total count: ', error);
    //                 res.json({ error: 'An error occurred' });
    //             }

    //             if (countResult <= 0) return;
    //             db.query(`SELECT * FROM stocks WHERE account_id = ?`, [id], (err, stockResult) => {
    //                 if (err) return res.json({ error: 'Error while fetching all the stocks!' });

    //                 if (stockResult <= 0) return;

    //                 db.query(`SELECT * FROM cash WHERE account_id = ?`, [id], (err, cashResult) => {
    //                     if (err) {
    //                         return res.json({ error: 'Error while fetching the cash!' });
    //                     }

    //                     if (cashResult <= 0) return;

    //                     const totalCount = countResult[0].totalCount;
    //                     const totalPages = Math.ceil(totalCount / perPage);
    //                     const totalLength = results.length;
    //                     res.json({ message: 'Success', data: results, totalPages, totalLength, stocks: stockResult, cash: cashResult, });
    //                 });
    //             });
    //         });
    //     }
    // );

app.listen(8081, () => {
    console.log('listening, hello from backend!')
})