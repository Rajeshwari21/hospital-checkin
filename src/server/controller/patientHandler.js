const Patient = require('../models/Patient');
const Firestore = require('@google-cloud/firestore');
const { response } = require('express');
const bcrypt = require ('bcrypt');

const db = new Firestore({
    projectId: 'hospital-295921',
    keyFilename: './hospital-295921-firebase-adminsdk-8sy78-23ec809e77.json',
});

var patients = [];

// Show list of patients.
exports.get_all_patients = function(req, res) {
    let result = [];
    db.collection('patients')
        .get()
        .then((snapshot) => {
            snapshot.docs.forEach((doc) => {
                result.push({ 
                    ...doc.data(),
                    password: '',
                    _uid: doc.id })
            });
            return res.json(result);
        })
        .catch((err) => {
            console.log('Error getting patients', err);
        });
};

// Add new patients.
exports.create_new_patients = function(req, res) {
    let name = req.body.name;
    if (checkIfNull("name", name, res)) return;
 
    let email = req.body.email;
    if (checkIfNull("email", email, res)) return;

    let inputPhNumber = req.body.phoneNo;
    if (checkIfNull("phoneNo", inputPhNumber, res)) return;

    let inputPasssword = req.body.password;
    if (checkIfNull("password", inputPasssword, res)) return;
    

    let data = new Patient(name, email, inputPhNumber, inputPasssword, null);
    patients.push(data);
    // add patient to database & also check if email id already exists.
    db.collection('patients').where('email', "==", email)
        .get()
        .then(function(querySnapshot) {
            if (querySnapshot._size === 0) {
                addPatientToDatabase(req.body, res);
            } else {
                res.json({
                    "success" : false,
                    "user": "already exists"
                });
            }
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

}

// Helper function to add patient details in the database.
function addPatientToDatabase(data, res) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(data.password, salt, function(err, hash) {
                  // Store hash in database here
            data.password = hash
            db.collection('patients')
                .add(JSON.parse(JSON.stringify(data)))
                .then(docRef => {
                    return res.json({
                        id: docRef.id,
                        success: true
                    });
                }).catch(e => {
                    console.error(e);
                })
         });
      });
    
}

// Get the details of specific patient.
exports.get_patient = function(req,res) {
    let patientId = req.params.id;
    db.collection('patients').doc(patientId).get().then((doc) => {
       return res.json(doc.data())
    }).catch(e => {
        res.json({err: `Patient with id ${patientId} not found`})
    })
}

// Update the details of a specific patient.
exports.update_patient = function(req, res) {
    let patientId = req.params.id;
    let updatePatientRef = db.collection('patients').doc(patientId);
    let updateData = updatePatientRef.update(req.body);
    updateData.then(e => {
        return res.json({
            "sucess": true,
            id: patientId,
            "updated": `Patient with id ${patientId} is updated`
        });
    }).catch(e => {
        res.json({err: `Patient with id ${patientId} not updated`})
    })
}

// Check if patient exist in the system.
exports.check_patient_exists = function(req, res) {
    let userEmail = req.body.email;
    let userPassword = req.body.password;
    db.collection('patients').where('email', "==", userEmail).limit(1)
        .get()
        .then(function(querySnapshot) {
            let data = {}
            querySnapshot.forEach(function(doc) {
                data = {id: doc.id, password: '', ...doc.data()}
            });
            bcrypt.compare(userPassword, data.password, function(err, result) {
                if (result) {
                    res.json({
                        ...data,
                        success: true
                    });
                }
                else {
                    res.json({
                        "success" : false,
                        "user": "user does not exist"
                    });
                }
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
}

// Delete the specific employee details.
exports.delete_patient = function(req, res) {
    let patientId = req.params.id;
    db.collection('patients').doc(patientId).get().then((doc) => {
        doc.ref.delete();
        res.json({
            "success": true,
            "deleted": `Patient with id ${patientId} is deleted.`
        })
    }).catch(e => {
        res.json({err: `Patient with id ${patientId} cannot be deleted.`})
    })
}

// Check if any null value exists.
const checkIfNull = function(field, data, res) {
    if(!data) {
        res.status(400).send({
            message: 'Must provide ' + field
        });
        return true;
    }
}
