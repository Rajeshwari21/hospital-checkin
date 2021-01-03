const Doctor = require('../models/Doctor');
const Firestore = require('@google-cloud/firestore');
const { response } = require('express');

const db = new Firestore({
    projectId: 'hospital-295921',
    keyFilename: './hospital-295921-firebase-adminsdk-8sy78-23ec809e77.json',
});

var doctors = [];

// Show the list of doctors.
exports.get_all_dr = function(req, res) {
    db.collection('doctors')
        .get()
        .then(snapshot => {
            let result = []
            snapshot.docs.forEach((doc) => {
                result.push({ ...doc.data(), _uid: doc.id })
            });
            res.json(result)
        })
}

// Add new doctors.
exports.create_new_doctors = function(req, res) {
    let name = req.body.fullName;
    if (checkIfNull("name", name, res)) return;
 
    let dosctorSpeciality = req.body.speciality;
    if (checkIfNull("email", dosctorSpeciality, res)) return;
    
    let availableSlots = req.body.availableSlots;

    let data = new Doctor(name, dosctorSpeciality, availableSlots);
    doctors.push(data);
    addDoctorToDatabase(data, res);

}

// Helper function to add patient details in the database.
function addDoctorToDatabase(data, res) {
    let newDoctorRef = db.collection('doctors').doc();
    let addDoctor = newDoctorRef.set(JSON.parse(JSON.stringify(data)))
    addDoctor.then(e => {
       return res.json(e);
    }).catch(e => {
        console.error(e);
    })
}

// Update doctor details.
exports.update_doctor = function(req, res) {
    var doctorId = req.params.id;
    let fullName = req.body.fullName;
    let dosctorSpeciality = req.body.speciality;
    let availableSlots = req.body.availableSlots;
    let updatePatientRef = db.collection('doctors').doc(doctorId);
    if (fullName) {
        var updateData = updatePatientRef.update({fullName: fullName});
    } if (dosctorSpeciality) {
        var updateData = updatePatientRef.update({speciality: dosctorSpeciality});
    } if (availableSlots) {
        var updateData = updatePatientRef.update({availability: availableSlots});
    }
    updateData.then(e => {
        return res.json({
            "sucess": true,
            "updated": `Doctor with id ${doctorId} is updated.`
        });
    }).catch(e => {
        res.json({err: `Doctor with id ${doctorId} not updated`})
    })
}

// Delete a doctor from the system.
exports.delete_doctor = function(req, res) {
    let doctorId = req.params.id;
    db.collection('doctors').doc(doctorId).get().then((doc) => {
        doc.ref.delete();
        res.json({
            "success": true,
            "deleted": `Doctor with id ${doctorId} is deleted.`
        })
    }).catch(e => {
        res.json({err: `Doctor with id ${doctorId} cannot be deleted.`})
    })
}

// Booking appointment of a doctor.
exports.book_appointment = function(req, res) {
    let doctorId = req.body.doctor;
    let patientId = req.body.patient;
    let date = req.body.date;
    let time = req.body.time;

    var docRef = db.collection('doctors').doc(doctorId);
    
    var patientRef = db.collection('patients').doc(patientId);

    docRef.get().then((doc) => {
        let data = doc.data();
        var doctorName = data.fullName;
        Object.keys(data.availability).forEach(element => {
            if (element === date) {
                data.availability[element] = data.availability[element].filter(atime => atime !== time)
            }
        });
        docRef.update(data);
        patientRef.get().then((patient) => {
            let patientData = patient.data();
            if('appointment' in patientData) {
                patientData.appointment.push({
                    'doctorName': doctorName,
                    docId: doctorId,
                    'date': date,
                    'time': time,
                    fees: data.fees
                })
                patientRef.update(patientData);
            } else {
                patientRef.update({'appointment': [{
                        'doctorName': doctorName,
                        docId: doctorId,
                        'date': date,
                        'time': time,
                        fees: data.fees
                    }]
                });
            }
        })
        res.json({
            "sucess": true,
            "updated": `Doctor with id ${doctorId} is booked.`
        })
        }).catch(e => {
        res.json({err: `Doctor with id ${doctorId} not found`})
    })    
}

// Cancelling the appointment.
exports.delete_appointment = function(req, res) {
    let patientId = req.params.id;
    let index = req.params.index;
    
    var patientRef = db.collection('patients').doc(patientId);
    patientRef.get().then(doc => {
        let data = doc.data();
        let appt = data.appointment[index]
        data.appointment = data.appointment.filter((appo, i) => i!=index)
        patientRef.update(data);

        var docRef = db.collection('doctors').doc(appt.docId);
        docRef.get().then(doct => {
            let dataa = doct.data();
            dataa.availability[appt.date].push(appt.time)
            docRef.update(dataa).then(() => {
                res.json({
                    success: true,
                    msg: 'Appointment deleted'
                })
            });
        })
    })
}

// Checking if any variable is null.
const checkIfNull = function(field, data, res) {
    if(!data) {
        res.status(400).send({
            message: 'Must provide ' + field
        });
        return true;
    }
}
