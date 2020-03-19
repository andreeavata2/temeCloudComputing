var http = require("http");
var studentsController = require("./controllers/student");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const Helpers = require("./Helpers")

mongoose.connect('mongodb+srv://andreea:fGNBfKIWEHc2EKcl@cluster0-80i2a.mongodb.net/test?retryWrites=true&w=majority/Students2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongodb connected....')
})

http.createServer(async(req, res) => {
    switch (req.method) {
        case "GET":
            if (req.url === "/" || req.url === "/students" || req.url === "/students/") {
                studentsController.getList(res);
            } else if (req.url.match(/\/students\/([0-9a-z]+)/)) {
                const id = req.url.match(/\/students\/([0-9a-z]+)/)[1];
                studentsController.getListById(res, id);
            } else {
                Helpers.handleError(res, { msg: 'Route not found for GET' }, 404)
            }
            break;
        case "POST":
            if (req.url === '/students' || req.url === '/students/') {
                let body = {};
                body = await Helpers.transformBodyToString(req)
                studentsController.insertStudent(res, body);
            } else {
                Helpers.handleError(res, { msg: 'Route not found for POST' }, 404)
            }

            break;
        case "PUT":
            if (req.url.match(/\/students\/([0-9a-z]+)/)) {
                const id = req.url.match(/\/students\/([0-9a-z]+)/)[1];
                let body = {};
                body = await Helpers.transformBodyToString(req)
                studentsController.putUpdate(res, body, id);
            } else if (req.url === '/students' || req.url === '/students/') {
                let body = {};
                body = await Helpers.transformBodyToString(req);
                studentsController.putAllStudents(res, body);
            } else {
                Helpers.handleError(res, { msg: 'Route not found for PUT' }, 404)
            }
            break;
        case "PATCH":
            if (req.url.match(/\/students\/([0-9a-z]+)/)) {
                const id = req.url.match(/\/students\/([0-9a-z]+)/)[1];
                let body = {};
                body = await Helpers.transformBodyToString(req)
                studentsController.updatePatch(res, body, id);
            } else if (req.url === '/students') {
                let body = {};
                body = await Helpers.transformBodyToString(req)
                studentsController.updatePatchAllStudents(res, body);
            } else {
                Helpers.handleError(res, { msg: 'Student PATCH error' }, 404)
            }
            break;
        case "DELETE":
            if (req.url.match(/\/students\/([0-9a-z]+)/)) {
                const id = req.url.match(/\/students\/([0-9a-z]+)/)[1];
                studentsController.deleteStudentById(res, id);
            } else if (req.url === '/students') {
                studentsController.deleteAll(res);
            } else {
                Helpers.handleError(res, { msg: 'The student cannot be deleted' }, 404)
            }
            break;
        default:
            break;
    }
}).listen(PORT, () => {
    console.log("Starting listening at : " + PORT)
});