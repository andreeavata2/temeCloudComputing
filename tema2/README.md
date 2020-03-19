# Students REST API

# Instruction to run the app locally
* Clone the project
* Go to project folder
* Run npm install
* Run npm start
* Open Postman https://www.postman.com/


* [GET All Students](#getAllStudents)
* [GET Student By ID](#getStudentById)
* [POST Create a Student](#createStudent)
* [PATCH Update a Student](#updateStudentById)
* [PATCH Update All Students](#updateAllStudents)
* [PUT Replace a Student](#replaceStudentById)
* [PUT Replace All Students](#replaceAllStudents)
* [DELETE Student By ID](#deleteStudentById)
* [DELETE All Students](#deleteAllStudents)

## getAllStudents

* Select Method [GET] in postman.
* Add the following URL: http://localhost:5000/students

## getStudentById

* Select Method [GET] in postman.
* Add the following URL: http://localhost:5000/students/ + id of student.


## createStudent

* Select Method [POST] in postman.
* Add the following URL: http://localhost:5000/students

    {
        "name": "Brad Pitt",
        "email": "brad.pitt@yahoo.com",
        "registrationNumber":"22222",
		"bursary": "300"
    }

## updateStudentById

* Select Method [PATCH] in postman.
* Add the following URL: http://localhost:5000/students/ + id of student

    {
        "email": "brad.pitt2@yahoo.com",
        "registrationNumber":"3333"
	}
	
## updateAllStudents

* Select Method [PATCH] in postman.
* Add the following URL: http://localhost:5000/students/

    {
		"bursary": "100"
	}


## replaceStudentById

* Select Method [PUT] in postman.
* Add the following URL: http://localhost:5000/students/ + id of student

    {
        "name": "Angelina Jolie",
        "email": "angelina.jolie@yahoo.com",
        "registrationNumber":"232323",
		"bursary": "500"
    }
	
## replaceAllStudents

* Select Method [PUT] in postman.
* Add the following URL: http://localhost:5000/students

{
	"data": 
	[{
		"name": "Andreea",
        "email": "andreea@yahoo.com",
        "registrationNumber":"221212",
		"bursary": "400"
		},
		{
		"name": "Vatamanelu",
        "email": "vatamanelu@yahoo.com",
        "registrationNumber":"9990009",
		"bursary": "450"
	}]
}

## deleteStudentById

* Select Method [DELETE] in postman.
* Add the following URL: http://localhost:5000/students/ + id of student

## deleteAllStudents

* Select Method [DELETE] in postman.
* Add the following URL: http://localhost:5000/students
