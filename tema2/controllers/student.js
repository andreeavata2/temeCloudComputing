var db = require("../models/db");
const Helpers = require("../Helpers")

module.exports.getList = async res => {
    try {
        const students = await db.find();
        return Helpers.handleSuccess(res, { data: students }, 200)
    } catch (err) {
        return Helpers.handleError(res, { msg: 'Went wrong' }, 500)
    }
}

module.exports.getListById = async(res, id) => {
    try {
        const student = await db.findById(id)
        return Helpers.handleSuccess(res, { data: student }, 200)
    } catch (err) {
        return Helpers.handleError(res, { msg: 'Not found' }, 404)
    }
}

module.exports.insertStudent = async(res, body) => {
    body = JSON.parse(body);

    const student = new db({
        name: body.name,
        email: body.email,
        registrationNumber: body.registrationNumber,
        bursary: body.bursary
    });
    try {
        const studentSaved = await student.save((err, response) => {
            if (err) throw err;
            else
                return Helpers.handleSuccess(res, { data: response }, 201)
        });
    } catch (err) {
        return Helpers.handleError(res, { msg: err }, 500)
    }
}

module.exports.deleteStudentById = async(res, id) => {
    var student;
    try {
        student = await db.findById(id)
    } catch (err) {
        return Helpers.handleError(res, { msg: 'error at search for Id: Id not found in DB' }, 404)
    }
    if (student)
        try {
            const removedStudent = await db.findByIdAndRemove(id)
            return Helpers.handleSuccess(res, { data: 'student was deleted' }, 200)
        } catch (err) {
            return Helpers.handleError(res, { msg: 'error at delete : Student not found in DB' }, 404)
        }
    else {
        return Helpers.handleError(res, { msg: 'Student not found in DB.' }, 404)
    }
}

module.exports.deleteAll = async(res) => {

    var students;
    try {
        students = await db.find({})
    } catch (err) {
        return Helpers.handleError(res, { msg: 'error at search all' }, 404)
    }

    if (students.length > 0) {
        try {
            const removedStudent = await db.remove({})
            return Helpers.handleSuccess(res, { data: 'All have been removed' }, 200)
        } catch (err) {
            return Helpers.handleError(res, { msg: 'error at delete : Student not found in DB' }, 404)
        }
    } else {
        return Helpers.handleError(res, { msg: 'There are no students to deleted.' }, 404)

    }

}

module.exports.updatePatch = async(res, body, id) => {
    body = JSON.parse(body);
    var student;
    try {
        student = await db.findById(id)
    } catch (err) {
        return Helpers.handleError(res, { msg: 'error at search for Id' }, 404)
    }
    var tempUser = {};

    if (body.name) {
        tempUser.name = body.name;
    }
    if (body.email) {
        tempUser.email = body.email;
    }
    if (body.registrationNumber) {
        tempUser.registrationNumber = body.registrationNumber;
    }
    if (body.bursary) {
        tempUser.bursary = body.bursary;
    }

    if (student) {
        try {
            const studentPatch = await db.findByIdAndUpdate(id, tempUser, { useFindAndModify: false });
            return Helpers.handleSuccess(res, { data: `student with id: ${id} successfully updated` }, 200)
        } catch (err) {
            return Helpers.handleError(res, { msg: 'error at patch : Student not found in DB' }, 404)
        }
    } else {
        return Helpers.handleError(res, { msg: 'error at patch' }, 404)
    }
}

module.exports.putUpdate = async(res, body, id) => {
    body = JSON.parse(body);
    var student;
    try {
        student = await db.findById(id)
    } catch (err) {
        return Helpers.handleError(res, { msg: 'error at search for Id' }, 404)
    }

    if (!body.name) {
        return Helpers.handleError(res, { msg: 'Error: name is empty.' }, 404)
    }
    if (!body.email) {
        return Helpers.handleError(res, { msg: 'Error: email is empty.' }, 404)
    }
    if (!body.registrationNumber) {
        return Helpers.handleError(res, { msg: 'Error: registrationNumber is empty.' }, 404)
    }
    if (!body.bursary) {
        return Helpers.handleError(res, { msg: 'Error: bursary is empty.' }, 404)
    }

    if (student) {
        try {
            const studentPut = await db.findByIdAndUpdate(id, body, { useFindAndModify: false });
            return Helpers.handleSuccess(res, { data: `student with id: ${id} successfully updated` }, 200)
        } catch (err) {
            return Helpers.handleError(res, { msg: err.errmsg || 'error at put with id' }, 404)
        }
    } else {
        return Helpers.handleError(res, { msg: 'error at put' }, 404)
    }
}

module.exports.updatePatchAllStudents = async(res, body) => {
    body = JSON.parse(body);
    body = body.bursary;
    var students;
    try {
        students = await db.find({})
    } catch (err) {
        return Helpers.handleError(res, { msg: 'error at search all' }, 404)
    }

    var newBursary;
    if (students.length > 0) {
        try {
            students.forEach(async(stud) => {
                newBursary = stud.bursary + body;
                stud.bursary = newBursary;
                const studentPatch = await db.findByIdAndUpdate(stud.id, stud, { useFindAndModify: false });
            })
            return Helpers.handleSuccess(res, { data: 'students successfully updated' }, 200)
        } catch (err) {
            return Helpers.handleError(res, { msg: 'patch error for all students' }, 404)
        }
    } else {
        return Helpers.handleError(res, { msg: 'There are no students to patch.' }, 404)

    }
}

module.exports.putAllStudents = async(res, body) => {
    body = JSON.parse(body);
    body = body.data;

    // clear list
    try {
        students = await db.remove({})
    } catch (err) {
        return Helpers.handleError(res, { msg: 'error at delete all on put global' }, 404)
    }

    try {
        body.forEach(async(stud) => {
            await customInsertStud(stud);
        });
        return Helpers.handleSuccess(res, { data: 'students successfully updated' }, 201)
    } catch (err) {
        return Helpers.handleError(res, { msg: 'Error at PUT for more students' }, 500)
    }

}

const customInsertStud = async stud => {
    body = stud;

    const student = new db({
        name: body.name,
        email: body.email,
        registrationNumber: body.registrationNumber,
        bursary: body.bursary
    });
    try {
        const studentSaved = await student.save((err, response) => {
            if (err) throw err;
        });
    } catch (err) {
        return Helpers.handleError(res, { msg: err }, 500)
    }
}