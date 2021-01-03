# Hospital checkin System

A hospital checkin system build using NodeJS, ReactJS & Express JS. The system includes login of the patient and enter patient details like his/her medical history, allergies, medication, procedures/surgeries, insurance details etc... The system provides an admin panel which shows all the patient logged in to the system.

[![Watch Video](https://user-images.githubusercontent.com/12795540/102944871-e8576680-4470-11eb-8294-a318dfdf9a87.png)](https://user-images.githubusercontent.com/12795540/102944552-f35dc700-446f-11eb-8212-07169f6dd01b.mov)

# Setup and Usage

`git clone git@github.com:USF-CS601-Fall20/side-project-Rajeshwari21.git`

Install the dependencies using npm package manager.
`npm install`

Used the firebase database. (Might need to add your own firebase-admin-api-key and firebase-config.js files) for this project to run.

`npm run start` - to start the react app.
`npm-run serve` - to star the server NodeJS.


## REST Routes:
| Routes | HTTP Verb | Description |
|--|--|--|
| /login | POST | Manage the login functionality.  |
| /patient | POST | Create a new patient.  |
| /patient | GET | Getting the list of all the patients in the system. |
| /patient/:id | PUT | Update the details of a specific patient. |
| /patient/:id | GET | Get the details of a specific patient. |
| /patient/:id | DELETE | Delete the details of a specific patient. |
| '/doctor' | POST | Create new doctors from URL  |
| '/doctor' | GET | Get the list of doctors.  |
| /doctor/:id | PUT | Update the details of a specific doctor |
| /doctor/:id | DELETE | Delete the data of a specific doctor |
| /bookappt | POST | Patient Booking an appointment of a specific doctor  |
| /bookappt/:id/:index | DELETE | Patient deleting appointment of specific doctor |



### Login
Login: To manage the patient login functionality.
![Image description](https://user-images.githubusercontent.com/12795540/99864614-31a65480-2b59-11eb-97d3-08460bba52de.png)
---



### Patient
 1. Create a new patient
 ![Image description](https://user-images.githubusercontent.com/12795540/99864499-85646e00-2b58-11eb-938f-bafdd3807c7d.png)
 ---

 2. Getting the list of all the patients in the system.
 ![Image description](https://user-images.githubusercontent.com/12795540/99864496-84334100-2b58-11eb-9e39-8c7d42bac1d8.png)
 ---

 3. Updating the data of a specific patient.
 ![Image description](https://user-images.githubusercontent.com/12795540/99864505-872e3180-2b58-11eb-98b9-68c093c9827a.png)
 ---

 4. Getting details of a specific patient.
 ![Image description](https://user-images.githubusercontent.com/12795540/99864650-792ce080-2b59-11eb-869e-2222979c02ee.png)
 ---

 5. Delete the record of a patient.
 ![Image description](https://user-images.githubusercontent.com/12795540/99864504-872e3180-2b58-11eb-91e6-2bd29c415959.png)
 ---




###  Doctor
 1. Create new doctors from POST URL
 ![Image description](https://user-images.githubusercontent.com/12795540/99864503-86959b00-2b58-11eb-8100-f9df5df7818b.png)
 ---

 2. Get the list of all the doctors
 ![Image description](https://user-images.githubusercontent.com/12795540/99864502-86959b00-2b58-11eb-8e7b-680d5391fcba.png)
 ---

 3. Booking appointment of a specific doctor through the patient screen
 ![Image description](https://user-images.githubusercontent.com/12795540/99864500-85fd0480-2b58-11eb-9f4f-019b0f3b460e.png)
 ---

 4. Cancelling the booking of a specific doctor by the patient.
 ![Image description](https://user-images.githubusercontent.com/12795540/99864495-82697d80-2b58-11eb-9ef8-db95b85e77f6.png)
 ---


### Admin
 1. Created a Admin panel which shows all the patients logged into the system.
 ![Image description](https://user-images.githubusercontent.com/12795540/99869401-9e344a00-2b7f-11eb-9b26-c2b2da0d3872.png)
