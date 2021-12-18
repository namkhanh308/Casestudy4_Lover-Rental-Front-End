function showLoginForm() {
    console.log("ABC")
    $('#myModal').modal("show");
}

function signIn() {
    let username = $('#username').val();
    let password = $('#password').val();
    let data = {
        username: username,
        password: password
    }
    $.ajax({
        url: "http://localhost:8080/api/login",
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        },
        data: JSON.stringify(data),
        success: function (data) {
            if (data.status != "pending") {
                if (data.oneRole == '[ROLE_ADMIN]') {
                    localStorage.setItem("user", JSON.stringify(data));
                    // window.location.href = "/viewWS/index.html"
                } else if (data.oneRole == '[ROLE_STAFF]') {
                    $.ajax({
                        url: "http://localhost:8080/api/staffs/find/" + data.id,
                        type: "GET",
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        },
                        success: function (staff) {
                            localStorage.setItem("staff", JSON.stringify(staff));
                            localStorage.setItem("user", JSON.stringify(data));
                            // window.location.href = "/viewWS/index.html"
                        }
                    })
                } else if (data.oneRole == '[ROLE_CHECKER]') {
                    $.ajax({
                        url: "http://localhost:8080/api/checkers/find/" + data.id,
                        type: "GET",
                        headers: {
                            'Accept': 'application/json',
                            'Content-type': 'application/json'
                        },
                        success: function (checkers) {
                            localStorage.setItem("checkers", JSON.stringify(checkers));
                            localStorage.setItem("user", JSON.stringify(data));
                            // window.location.href = "/viewWS/index.html"
                        }
                    })
                }
            }
            else {
                alert("Tai khoan cua ban dang cho xac nhan")
            }
        }
    })
}

function showRegisterForm() {
    $('#myModal1').modal("show");
}

function showCheckerForm() {
    $('#myModal1').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#myModal2').modal("show");
}

function CheckerRegisterAccount() {
    let username = $('#username1').val();
    let password = $('#password1').val();
    let fullname = $('#fullname1').val();
    let email = $('#email1').val();
    let phone = $('#phone1').val();
    let newCheckerAccount = {
        username: username,
        password: password,
        fullName: fullname,
        email: email,
        phone: phone,
        status: {
            id: 1
        },
        roles: [
            {
                id: 3
            }
        ]
    };

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newCheckerAccount),
        url: "http://localhost:8080/api/accounts",
        success: function (data) {
            createChecker(data.id)
        }
    })


}

function createChecker(id) {

}


function showStaffForm() {
    $('#myModal1').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#showFormAccountStaff').modal("show");
}

function RegisterAccountStaff() {
    let username = $('#username2').val();
    let password = $('#password2').val();
    let fullname = $('#fullname2').val();
    let email = $('#email2').val();
    let phone = $('#phone2').val();
    let balance = 0.0;
    let form = {
        username: username,
        password: password,
        fullName: fullname,
        email: email,
        phone: phone,
        balance: balance,
        status: {
            id: 1
        },
        roles: [{
            id: 2
        }]
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "http://localhost:8080/api/accounts",
        type: "POST",
        data: JSON.stringify(form),
        success: function (data) {
            console.log(data)
            let idAccount = data.id;
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                url: "http://localhost:8080/api/genders",
                type: "GET",
                success: function (data) {
                    let listTypes = [];
                    listTypes = data;
                    let userSelect = document.getElementById("gender");
                    listTypes.forEach(function (option) {
                        var opt = document.createElement('option');
                        opt.value = option.id;
                        opt.innerHTML = option.name;
                        userSelect.appendChild(opt);
                        $('#idAccount').val(idAccount);
                        $('#showFormAccountStaff').modal('hide');
                        $('#showFormRegisterForStaff').modal('show');
                    })
                }
            })
            event.preventDefault();
        }.error(alert("Bạn nhập sai"))

    })
    event.preventDefault();
}

async function upload(file, listimg) {
    let link;
    const ref = firebase.storage().ref();
    const metadata = {
        contentType: file.type
    }
    const name = file.name;
    const uploadIMG = ref.child(name).put(file, metadata);
    await uploadIMG
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            link = url;
        })
        .catch(console.error)
    listimg.push(link);
}

function RegisterStaff() {
    let idAccount = $('#idAccount').val()
    let city = $('#city1').val();
    let description = $('#description').val();
    let name = $('#name1').val();
    let dob = $('#dob1').val();
    let nationality = $('#nationality1').val();
    let height = $('#height1').val();
    let weight = $('#weight1').val();
    let gender = $('#gender').val();
    var listimg = [];
    for (let i = 0; i < 3; i++) {
        let selectedFile = document.getElementById('photo').files[i]
        upload(selectedFile, listimg);
    }
    let form = {
        name: name,
        dob: dob,
        city: city,
        nationality: nationality,
        height: height,
        weight: weight,
        description: description,
        gender: {
            id: gender
        },
        account: {
            id: idAccount
        },
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        url: "http://localhost:8080/api/staffs",
        type: "POST",
        data: JSON.stringify(form),
        success: function (data) {
            console.log(data)
            let idAccount = data.id;
            for (let i = 0; i < 3; i++) {
                console.log(listimg[0])
                let avatarlist = {
                    image: listimg[0],
                    staff: {
                        id: idAccount
                    }
                }
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: "http://localhost:8080/api/avatar",
                    type: "POST",
                    data: JSON.stringify(avatarlist),
                    success: function () {
                        console.log("ANh" + i)
                    }
                })
            }

        }
    })

    event.preventDefault();
}

