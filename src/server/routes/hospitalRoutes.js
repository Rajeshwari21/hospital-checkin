module.exports = function(app) {

  const patientHandler = require('../controller/patientHandler.js');
  const doctorHandler = require('../controller/doctorHandler.js');

  app.route('/patient').get(patientHandler.get_all_patients).post(patientHandler.create_new_patients);

  app.route('/login').post(patientHandler.check_patient_exists);
  app.route('/patient/:id').get(patientHandler.get_patient)
    .put(patientHandler.update_patient)
    .delete(patientHandler.delete_patient);

  app.route('/doctor').post(doctorHandler.create_new_doctors).get(doctorHandler.get_all_dr);
  app.route('/doctor/:id').put(doctorHandler.update_doctor)
    .delete(doctorHandler.delete_doctor);
  
  app.route('/bookappt').post(doctorHandler.book_appointment);
  app.route('/bookappt/:id/:index').delete(doctorHandler.delete_appointment);
};
