import axios from "axios";

axios.defaults.withCredentials = true;

export function handleLogout(navigate) {
    axios.get('http://localhost:8081/logout')
        .then((res) => {
            const data = res.data;
            if (data.message === "Success") {
                navigate('/');
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

export function handleTotalStocks(stockResults) {
    let stocks_length = 0;

    stockResults.forEach((data) => {
        const currentDate = new Date();

        // Check if data.date_expired exists and is not null/undefined
        if (data.date_expired) {
            const dateParts = data.date_expired.split('-');
            // Rearrange the date parts to match "MM-DD-YYYY" format
            const inputDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

            if (!isNaN(inputDate.getTime())) {
                const diffTime = inputDate - currentDate;
                const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDay >= 1) {
                    const quantity = data.quantity;

                    if (parseInt(quantity) >= 1) {
                        ++stocks_length;
                    }
                }
            } else {
                console.error('Invalid date:', data.date_expired);
                // Handle the invalid date, e.g., set diffDay to a default value or skip this entry
            }
        }
    });

    return stocks_length;
}

export function handleTotalPriceTotalPrice (stockResults) {
    let total_price = 0
    stockResults.forEach((data) => {

        if (data.date_expired){
            const currentDate = new Date();
            const dateParts = data.date_expired.split('-'); // Assuming the format is "MM-DD-YYYY"

            // Rearrange the date parts to match "MM-DD-YYYY" format
            const inputDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

            // Check if inputDate is a valid date
            if (isNaN(inputDate.getTime())) {
                console.error('Invalid date:', data.date_expired);
                // Handle the invalid date, e.g., set diffDay to a default value or skip this entry
            } else {
                // Calculate the difference in days
                const diffTime = (inputDate - currentDate);
                const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDay >= 1){
                    const quantity = data.quantity
                    if (parseInt(quantity) >= 1){
                        let sum = data.total_price
                        total_price = total_price + parseFloat(sum)
                    }
                }
            }
        }
        
    })

    return total_price.toFixed(2) 
}

export function handleTotalOutOfStocks (stocksResults) {
    let outOfStockLength = 0
    stocksResults.forEach((data) => {

        if (data.date_expired) {
            const currentDate = new Date();
            const dateParts = data.date_expired.split('-'); // Assuming the format is "MM-DD-YYYY"
    
            // Rearrange the date parts to match "MM-DD-YYYY" format
            const inputDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);

            // Check if inputDate is a valid date
            if (isNaN(inputDate.getTime())) {
                console.error('Invalid date:', data.date_expired);
                // Handle the invalid date, e.g., set diffDay to a default value or skip this entry
            } else {
                // Calculate the difference in days
                const diffTime = (inputDate - currentDate);
                const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
                if (diffDay >= 1){
                        const quantity = data.quantity
                        if (parseInt(quantity) <= 0){
                            ++outOfStockLength
                        }
                }
            }
        }
    })
    
    return outOfStockLength
}

export function handleCash (cash) {
    let cashMoney = 0
    cash.forEach((data) => {
        cashMoney = data.cash
    })
    return parseInt(cashMoney)
}

export function handleTotalExpired (stockResults) {
    let expired = 0

    stockResults.forEach((data) => {

        if (data.date_expired) {
            const currentDate = new Date();
            const dateParts = data.date_expired.split('-'); // Assuming the format is "MM-DD-YYYY"
    
            // Rearrange the date parts to match "MM-DD-YYYY" format
            const inputDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);
            
            // Check if inputDate is a valid date
            if (isNaN(inputDate.getTime())) {
                console.error('Invalid date:', data.date_expired);
                // Handle the invalid date, e.g., set diffDay to a default value or skip this entry
            } else {
                // Calculate the difference in days
                const diffTime = (inputDate - currentDate);
                const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
                if (diffDay <= 0 || diffDay === 0){
                    ++expired
                }
            }
        }
        
    })

    return expired
}

export function handleAmountLoss(stockResults) {
    let expire_total_price = 0;

    stockResults.forEach((data) => {
        const currentDate = new Date();

        // Check if data.date_expired exists and is not null/undefined
        if (data.date_expired) {
            const dateParts = data.date_expired.split('-');
            const inputDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);


            const diffTime = inputDate - currentDate;
            const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDay <= 0) {
                let sum = data.total_price;
                expire_total_price = expire_total_price + parseInt(sum);
            }
        }
    });

    return expire_total_price.toFixed(2);
}

export function handleDateColor(date1, quantity) {
    const currentDate = new Date(); // Current date
  
    // Split the input date string into parts
    const dateParts = date1.split('-'); // Use '-' as the delimiter for MM-DD-YYYY
  
    // Ensure that there are exactly three parts (MM-DD-YYYY)
    if (dateParts.length === 3) {
      // Parse the input date components
        const month = parseInt(dateParts[0], 10);
        const day = parseInt(dateParts[1], 10);
        const year = parseInt(dateParts[2], 10);
    
        // Check if the date components are valid
        if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
            // Create a Date object with the parsed components
            const inputDate = new Date(`${month}-${day}-${year}`);
    
            // Calculate the difference in days
            const diffTime = inputDate - currentDate;
            const diffDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
            if (quantity <= 0 && diffDay >= 1) {
                return 'bg-yellow-300 hover:bg-yellow-500 hover:text-white';
            } else if (diffDay >= 61) {
                return 'bg-green-300 hover:bg-green-500 hover:text-white ';
            } else if (diffDay <= 60 && diffDay >= 1) {
                return 'bg-blue-300 hover:bg-blue-500 hover:text-white';
            } else if (diffDay <= 0) {
                return 'bg-red-300 hover:bg-red-500 hover:text-white';
            }
        }
    }
}
  
export function date () {
    const date = new Date()
    let month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()
    if (parseInt(month) <= 9){
        month = '0' + month
    }
    return month + '/' + day + '/' + year
}

export function time () {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hours = hour >= 12 ? hour - 12 : hour
    return hours + ':' + minutes + ':' + seconds + ' ' + ampm
}

export function totalProducts  (products) {
    return products.reduce((total, product) => {
        return total + (product.price || 0);
    }, 0);
}

export function getTotalCash (cash) {
    return cash.reduce((total, product) => {
        return total + (product.cash || 0)
    })
}

export async function accountInfo() {
    try {
        const response = await axios.get('http://localhost:8081/', );
        return response.data;
    } catch (error) {
        throw error
    }
}

export async function resultLogin (values){
    try {
        const response = await axios.post('http://localhost:8081/login', values)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function resultSubmitContact (email, message) {
    try {
        const response = await axios.post('http://localhost:8081/contact', { email, message })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultForgotPassword (email) {
    try {
        const response = await axios.get(`http://localhost:8081/forgotPassword?email=${email}`, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultResetPassword (accountId, token, password) {
    try {
        const response = await axios.put(`http://localhost:8081/resetpassword/${accountId}/${token}`, { password })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultEmailIsNotRegistered (values) {
    try {
        const response = await axios.post('http://localhost:8081/validateEmail', { email: values.email })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function resultRegister (values) {
    try {
        const response = await axios.post(`http://localhost:8081/register`, values)
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

export async function resultAmountLoss (id) {
    try {
        const response = await axios.get(`http://localhost:8081/amountLoss/${id}`, )    
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultTotalExpired (id) {
    try {
        const response = await axios.get(`http://localhost:8081/totalExpired/${id}`, )    
        return response.data    
    } catch (error) {
        console.log(error)
    }
}

export async function resultTotalCash (id) {
    try {
        const response = await axios.get(`http://localhost:8081/totalCash/${id}`,);
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultOutOfStocks (id) {
    try {
        const response = await axios.get(`http://localhost:8081/totalOutOfStocks/${id}`, );
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultTotalStocks (id) {
    try {
        const response = await axios.get(`http://localhost:8081/totalStocks/${id}`, );
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultFetchStock (currentPage, search, id){
    try {
        const response = await axios.get(`http://localhost:8081/dashboard?page=${currentPage}&search=${search}&id=${id}`, );
        return response.data
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export async function resultFetchStocks (search, id){
    try {
        const response = await axios.get(`http://localhost:8081/stocks?&search=${search}&id=${id}`, { timeout: 5000 });
        return response.data
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export async function resultAddStock (id, barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired){
    try {
        const response = await axios.post(`http://localhost:8081/addStock/${id}`, {barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired }, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultHistory (message, id){
    try {
        const response = await axios.post(`http://localhost:8081/history`, { id, message }, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultStockInfo(id) {
    try {
        const response = await axios.get(`http://localhost:8081/getStock/${id}`, { timeout: 5000 } );
        return response.data; // Return the data from the response
    } catch (error) {
        console.log(error);
        throw error; // Rethrow the error to be caught by the caller
    }
}

export async function resultUpdateStocks (accountId, id, barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired) {
    try {
        const response = await axios.put(`http://localhost:8081/updateStock/${accountId}/${id}`, { barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired},)
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultDeleteStock (accountId, barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired) {
    try {
        const response = await axios.post(`http://localhost:8081/deleteStock/${accountId}`, {barcode, productName, productQuantity, productPrice, totalPrice, dateStockIn, dateExpired}, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultDeletedStock (accountId, id) {
    try {
        const response = await axios.delete(`http://localhost:8081/deletedStock/${accountId}/${id}`, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

// `id`, `account_id`, `barcode`, `product_name`, `quantity`, `price`, `total_price`, `date_bought`
export async function resultItemBought (products) {
    try {
        const response = await axios.post(`http://localhost:8081/item_bought`, { products })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultItemBoughtCash (accountId, total) {
    try {
        const response = await axios.post(`http://localhost:8081/item_bought_cash/${accountId}`, { total })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultUpdateProductBought (products) {
    try {
        const response = await axios.put(`http://localhost:8081/updateProductBought`, { products })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultRemoveProductBought (accountId, productId, quantity) {
    try {
        const response = await axios.put(`http://localhost:8081/removeProductBought/${accountId}/${productId}`, { quantity })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultCashIn  (accountId, amount)  {
    try {
        const response = await axios.post(`http://localhost:8081/cashIn/${accountId}`, { amount })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultCashInHistory (accountId, amount) {
    try {
        const response = await axios.post(`http://localhost:8081/cashInHistory/${accountId}`, { amount })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultCashOut  (accountId, amount)  {
    try {
        const response = await axios.post(`http://localhost:8081/cashOut/${accountId}`, { amount })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultCashOutHistory (accountId, amount) {
    try {
        const response = await axios.post(`http://localhost:8081/cashOutHistory/${accountId}`, { amount })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultFetchCashInOutHistory (accountId, currentPage) {
    try {
        const response = await axios.get(`http://localhost:8081/cashInOutHistory?currentPage=${currentPage}&accountId=${accountId}`,);
        return response.data
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export async function resultFetchCashIn (accountId, currentPage) {
    try {
        const response = await axios.get(`http://localhost:8081/cashInHistoryOnly?currentPage=${currentPage}&accountId=${accountId}`,);
        return response.data
    } catch (error) {
        console.error('Error fetching items:', error);
    }
} 

export async function resultFetchCashOut (accountId, currentPage) {
    try {
        const response = await axios.get(`http://localhost:8081/cashOutHistoryOnly?currentPage=${currentPage}&accountId=${accountId}`,);
        return response.data
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

export async function resultFetchAllReports (accountId, currentPage) {
    try {
        const response = await axios.get(`http://localhost:8081/allReportHistory?accountId=${accountId}&currentPage=${currentPage}`, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultFetchReports (accountId, firstDate, secondDate, currentPage) {
    try {
        const response = await axios.get(`http://localhost:8081/reportsHistory?accountId=${accountId}&firstDate=${firstDate}&secondDate=${secondDate}&currentPage=${currentPage}`, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export async function resultFetchHistory (accountId, currentPage) {
    try {
        const response = await axios.get(`http://localhost:8081/allHistory?accountId=${accountId}&currentPage=${currentPage}`, )
        return response.data
    } catch (error) {
        console.log(error)
    }
}