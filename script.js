let users = []
let arrBookList = []
let userBookList = []
// document.getElementById("loadingMessage").style.display = "block"

$(function () {
    
    //  ``````````````````clock``````````````````
    function clock() {
        var date = new Date()
        days = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "Пятниця", "Субота"]
        months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"]
        day = days[date.getDay()]
        month = months[date.getMonth()]
        dateNumber = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
        hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours()
        minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes()
        seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
        // document.getElementById('clock').innerHTML = day + ', ' + month + ' ' + dateNumber + ', ' + hours + ':' + minutes + ':' + seconds
        let saveHourNow = document.getElementById('clock').innerHTML = hours + ':' + minutes + ':' + seconds + `<br>` + dateNumber + ` ` + month + `, ` + day
        return saveHourNow
    } setInterval(clock, 1000)
    clock()
    //  ``````````````````clock END``````````````````

    let formBtn = document.getElementById('formBtn')


    //   `````````````````````````user.JSON`````````````````````````
    fetch('./user.JSON')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            users = data.users

            // Form
            formBtn.addEventListener('click', function () {
                let email = document.getElementById('email').value
                let password = document.getElementById('password').value

                for (const iterator of users) {
                    if (email == iterator.email && password == iterator.password) {

                        // Збереження даних в localStorage
                        localStorage.setItem('email', email)
                        localStorage.setItem('password', password)
                        localStorage.setItem('clock', clock())

                        // Завантаження даних з localStorage
                        let storedEmail = localStorage.getItem('email')
                        let storedPassword = localStorage.getItem('password')
                        let storedClock = localStorage.getItem('clock')

                        // Відображення завантажених даних на сторінці
                        $('#visitUser').html(`
                            <hr>
                            Email: ${storedEmail}<br>
                            Password: ${storedPassword}<br>
                            Last Visit: ${storedClock}
                            <hr>
                        `)


                        loadContent(iterator)
                        break
                    }

                }
            }) // Form end
        })

    $("#adminTabs").tabs().css({
        'display': 'none'
    })
    $("#userTabs").tabs().css({
        'display': 'none'
    })

    // Завантажити сторінку 
    function loadContent(user) {
        $('.formCenter').css({
            'display': 'none'
        })
        //``````````````````````````Admin``````````````````````````
        if (user.type == 'admin') {
            $("#adminTabs").css({
                'display': 'block'
            })
            greeting(user.type, user.name)
            loadBooksAdmin(arrBookList)
        }

        //``````````````````````````User``````````````````````````
        else if (user.type == 'user') {
            let userBooks = localStorage.getItem(user.email)

            if (!userBooks) { //якщо в локал сторич ще не має користувача - створємо
                localStorage.setItem(user.email, JSON.stringify([])) // створили новий
            } else {
                userBooks = JSON.parse(userBooks)
                if (userBooks.length >= 1) {
                    alert(`Ви ще не здали книжку!
                    ${userBooks}
                    `)
                }
            }

            $("#userTabs").css({
                'display': 'block'
            })
            greeting(user.type, user.name)
            loadBooksUser(arrBookList)
        }
    }


    // '''''''''''''''''''''''''''Привітання''''''''''''''''''''''''''' 
    function greeting(userType, userName) {
        let storedEmail = localStorage.getItem('email')
        let storedClock = localStorage.getItem('clock')
        if (userType == 'admin') {
            $('#helloAdmin').html(`
                <div style="text-align: center;">
                    <h3>Дай Боже здоров'я Адміністратор:</h3>
                    <h2 style="font-family: cursive;">${userName}</h2>
                </div>
                <p style="text-align: center;">Останній раз користувач: <b>${storedEmail}</b><br>
                Заходив на сайт: <b>${storedClock}</b>
                </p>
            `)
        }

        //``````````````````````````User``````````````````````````
        else if (userType == 'user') {
            let value
            value = localStorage.getItem(storedEmail)
            console.log(value)




            $('#helloUser').html(`
                <div style="text-align: center;">
                    <h3>Дай Боже здоров'я користувач:</h3>
                    <h2 style="font-family: cursive;">${userName}</h2>
                        <div id="debt">
                            ви взяли: <b style="font-family: cursive;">${value}</b><br><br>
                           <input type="button" value="Здати всі книги" id="returnButton">
                        </div>
                </div>
                <hr>
                <p style="text-align: center;">Останній раз користувач: <b>${storedEmail}</b><br>
                Заходив на сайт: <b>${storedClock}</b>
                </p>
                <hr>
            `)




            // ```````````````````почистити localStorage```````````````````
            $('#debt').on('click', function () {
                $('.book').css({
                    'opacity': '100%'
                })
                $('.rentalBook').css({
                    'display': 'block'
                })

                // /видалення
                let userEmail = localStorage.getItem('email')
                localStorage.removeItem(userEmail)
                //
            })
        }
    }

    fetch('./user.JSON')
        .then(response => response.json())
        .then(userListData => {
            $(function () {
                $("#tabs-2").tabs()
                userList(userListData)
            })
        })
        .catch(error => {
            console.error('Помилка під час завантаження "user.JSON"', error)
        })

    let visitorID = 0

    // Переглянути список усіх відвідувачів
    function userList(data) {
        let users = data.users
        let visitorsList = $('#visitorsList').css({
            'max-height': '300px',
            'overflow-y': 'auto',
            'background-color': '#f4f4f4',
            'border': '1px solid #ccc',
            'padding': '15px',
            'margin': '10px 0',
            'border-radius': '5px',
            'font-family': '"Arial", sans-serif',
        });

        users.forEach(user => {
            let registrationDate = user.registration_date
            let phoneNumber = user.phone;
            let userName = user.name;
            let userEmail = user.email;
            visitorID++;
            let userItem = $('<ol></ol>').css({
                'color': '#333',
                'margin-bottom': '10px',
            }).html(`
        <li class="listStyleTypeNone" style="line-height: 1.6;">
            <strong>${visitorID}. ${userName}</strong><br>
            <a href="mailto:${userEmail}" style="color: #007BFF;">${userEmail}</a><br>
            <a href="tel:${phoneNumber}" style="color: #007BFF;">${phoneNumber}</a><br>
            Registration Date: <span style="color: #888;">${registrationDate}</span><br>
            <input type="button" value="Редагувати відвідувача" class="editVisitorsBtn" data-id="${visitorID}" data-name="${userName}" data-phone="${phoneNumber}" data-email="${userEmail}" >
            <hr>
        </li>
    `);
            visitorsList.append(userItem);
        });
    }

    // Додати нового відвідувача
    $('#addVisitorsBtn').on('click', function () {
        let isConfirmed = confirm('Ви хочете додати нового відвідувача?')
        let nameVisitor, emailVisitor, phoneVisitor
        // time
        function getCurrentTime() {
            var date = new Date();
            var dateStr =
                ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
                ("00" + date.getDate()).slice(-2) + "/" +
                date.getFullYear() + " " +
                ("00" + date.getHours()).slice(-2) + ":" +
                ("00" + date.getMinutes()).slice(-2) + ":" +
                ("00" + date.getSeconds()).slice(-2);

            return dateStr;
        }
        let time = getCurrentTime()
        // time


        if (isConfirmed) {
            nameVisitor = prompt('Введіть імя')
            emailVisitor = prompt('Введіть Email')
            phoneVisitor = prompt('Введіть свій номер телефону')
            // Не забудьте визначити або замінити цю функцію на потрібну вам

            if (nameVisitor && emailVisitor && phoneVisitor) {
                visitorID++
                let newUserItem = $('<ol></ol>').css({
                    'color': '#333',
                    'margin-bottom': '10px',
                }).html(`
                <li class="listStyleTypeNone" style="line-height: 1.6;">
                    <strong>${visitorID}. ${nameVisitor}</strong><br>
                    <a href="mailto:${emailVisitor}" style="color: #007BFF;">${emailVisitor}</a><br>
                    <a href="tel:${phoneVisitor}" style="color: #007BFF;">${phoneVisitor}</a><br>
                    Registration Date: <span style="color: #888;">${time}</span><br>
                    <input type="button" value="Редагувати відвідувача" class="editVisitorsBtn" data-id="${visitorID}" data-name="${nameVisitor}" data-phone="${phoneVisitor}" data-email="${emailVisitor}" >
                    <hr>
                </li>
            `)
                $('#visitorsList').append(newUserItem)
            }
        }

    })

    //  змінити існуючого відвідувач
    $('#visitorsList').on('click', '.editVisitorsBtn', function () {
        let visitorID = $(this).data('id')
        let nameVisitor = $(this).data('name')
        console.log(nameVisitor)
        let emailVisitor = $(this).data('email')
        let phoneVisitor = $(this).data('phone')
        let isConfirmed = confirm(`Ви хочете редагувати відвідувача\n${visitorID}. ${nameVisitor}`)
        // time
        function getCurrentTime() {
            var date = new Date();
            var dateStr =
                ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
                ("00" + date.getDate()).slice(-2) + "/" +
                date.getFullYear() + " " +
                ("00" + date.getHours()).slice(-2) + ":" +
                ("00" + date.getMinutes()).slice(-2) + ":" +
                ("00" + date.getSeconds()).slice(-2);

            return dateStr;
        }
        let time = getCurrentTime()
        // time

        // Тут код для редагування відвідувача
        if (isConfirmed) {
            let newName = prompt(`Введіть нове ім'я, ${nameVisitor}`)
            let newEmail = prompt(`Введіть новий Email, ${emailVisitor}`)
            let newPhone = prompt(`Введіть новий номер телефону, ${phoneVisitor}`)
            if (newName && newEmail && newPhone) {
                $(this).closest('li').html(`
        <strong>${visitorID}. ${newName}</strong><br>
        <a href="mailto:${newEmail}" style="color: #007BFF;">${newEmail}</a><br>
        <a href="tel:${newPhone}" style="color: #007BFF;">${newPhone}</a><br>
        Edit Date: <span style="color: #888;">${time}</span><br>
        <input type="button" value="Редагувати відвідувача" class="editVisitorsBtn" data-id="${visitorID}" data-name="${newName}" data-phone="${newPhone}" data-email="${newEmail}" >
        <hr>
        `)
            }
        }
    })

    //   `````````````````````````books.JSON`````````````````````````

    fetch('./books.JSON')
        .then(response => response.json())
        .then(bookList => {
            arrBookList = bookList
        })
        .catch(error => {
            console.error('Помилка під час завантаження "books.JSON"', error)
        })

    // `````````````````Покозати книги Адміністратору`````````````````
    function loadBooksAdmin() {
        let bookID = 0
        //  Вивести книги на екран
        arrBookList.forEach((book, index) => {
            bookID++
            $('#displayBooksAdmin').append(`
                <p class="book" id="book-${index}">
                    ${bookID}.
                    <b>${book.title}</b> <br>
                    Автор: ${book.author}<br>
                    Жанр: ${book.genre}<br><br>
                    <input type="button" value="Видалити книгу" class="deletedBooks" data-book-id="book-${index}">
                    <input type="button" value="Редагувати книгу" class="editBooks" data-book-id="book-${index}">
                </p>
            `)
        })

        // Додати нову книгу
        $('#addBook').on('click', function () {
            let newBook, newAuthor, newGenre;
            let confirmAction = confirm('ви хочете додати нову книгу?')
            if (confirmAction) {
                newBook = prompt('Введіть назву книги!')
                newAuthor = prompt('Введіть автора книги!')
                newGenre = prompt('Введіть Жанр книги!')
                bookID++; // increment the bookID for the next book
                $('#displayBooksAdmin').append(`
                    <p class="book" id="book-${bookID}">
                        ${bookID}.
                        <b>${newBook}</b> <br>
                        Автор: ${newAuthor}<br>
                        Жанр: ${newGenre}<br><br>
                        <input type="button" value="Видалити книгу" class="deletedBooks" data-book-id="book-${bookID}">
                        <input type="button" value="Редагувати книгу" class="editBooks" data-book-id="book-${bookID}">
                    </p>
                `)
            }
        })

        // видалити існуючу книгу
        $('#displayBooksAdmin').on('click', '.deletedBooks', function () {
            let confirmation = confirm('Ви хочете видалити книгу з цього списку?')
            if (confirmation) {
                let bookId = $(this).data('book-id')
                $(`#${bookId}`).remove()
            }
        })

        // змінити існуючу книгу
        $('#displayBooksAdmin').on('click', '.editBooks', function () {
            let confirmation = confirm('Ви хочете замінити книгу з цього списку?')
            if (confirmation) {
                let bookId = $(this).data('book-id')
                let newTitle = prompt('Введіть новий заголовок:')
                let newAuthor = prompt('Введіть нового автора:')
                let newGenre = prompt('Введіть новий жанр:')

                $(`#${bookId}`).html(`
                    Title: ${newTitle}<br>
                    Author: ${newAuthor}<br>
                    Genre: ${newGenre}<br><br>
                    <input type="button" value="Видалити книгу" class="deletedBooks" data-book-id="${bookId}">
                    <input type="button" value="Редагувати книгу" class="editBooks" data-book-id="${bookId}">
                `)
            }
        })
    }

    // `````````````````Покозати книги Користувачу`````````````````
    function loadBooksUser(arrBookList) {
        arrBookList.forEach((book, index) => {
            $('#displayBooksUser').append(`
                <p class="book" id="book-${index}">
                    ${index + 1}:
                    <b>${book.title}</b> <br>
                    Author: ${book.author}<br>
                    Genre: ${book.genre}<br><br>
                    <input type="button" value="book rental" class="rentalBook" data-book-id="${index}">
                </p>
            `)
        })
        // modal window
        let modalWindow = `
            <div class="dialog" id="dialog" title="Book Rental">
                <p id="dialog-content"></p>
            </div>
        `
        $('body').append(modalWindow)

        $('#dialog').css({
            'text-align': 'center',
            'font-family': 'cursive',
            'font-weight': 'bold'
        })

        // 
        $('.rentalBook').on('click', function () {
            let bookId = $(this).data('book-id')
            let bookTitle = arrBookList[bookId].title
            $("#dialog-content").text(`Ви хочете взяти книгу \n ${bookId + 1}: ${bookTitle}.`)
            $("#dialog").data('book-id', bookId)
            dialog.dialog("open")
        })
        let dialog = $("#dialog").dialog({
            autoOpen: false,
            hide: {
                effect: "Fold",
                duration: 1000
            },
            buttons: {
                "Tak": function () {
                    let bookId = $(this).data('book-id')
                    let bookTitle = arrBookList[bookId].title



                    //rentedBooks.push(bookTitle);  // додаємо книгу в масив rentedBooks
                    //localStorage.setItem('rentedBooks', JSON.stringify(rentedBooks));  // зберігаємо масив в localStorage


                    // ################################## ПИСАЛА ІРА  - добавлення нової книжни

                    let userEmail = localStorage.getItem('email');
                    let userArray = localStorage.getItem(userEmail)
                    // console.log(userArray)
                    // console.log(userEmail)
                    if (userArray) {
                        let arr1 = JSON.parse(userArray);
                        arr1.push(bookTitle);
                        localStorage.setItem(userEmail, JSON.stringify(arr1))
                    } else {
                        let newArray = [bookTitle]
                        localStorage.setItem(userEmail, JSON.stringify(newArray))
                    }

                    // ##################################

                    // console.log(localStorage.getItem('oleksii_sergiiovych@example.com'))

                    $(this).dialog("close")
                    $("#book-" + bookId).css({ 'opacity': '20%' })
                    $('.rentalBook[data-book-id="' + bookId + '"]').css({
                        'display': 'none'
                    })
                },
                Cancel: function () {
                    $(this).dialog("close")
                }
            },
            show: {
                effect: "Fold",
                duration: 1000
            }

        })
    }

    setTimeout(function () {
        // console.log(arrBookList)
    }, 100)
})

// document.getElementById("loadingMessage").style.display = "none"