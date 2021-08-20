const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/wou', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


// const Contact = mongoose.model('Contact', {
//     nama: {
//         type: String,
//         required: true,
//     },
//     nohp: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: Object,
//     },
// });

// //Menambah Satu Data
// const contact1 = new Contact({
//     nama: 'A Fauzan ',
//     nohp: '0898509413',
//     email: [{ nama: 'f', kelas: '2' }, { nama: 'f2', kelas: '21' }],
// });

// //Simpan ke collection
// contact1.save().then((contact) => console.log(contact));