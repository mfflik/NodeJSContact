const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require('method-override')

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;
const { body, validationResult, check } = require("express-validator");
let i = 0;

//Setup method override
app.use(methodOverride('_method'));

// Setup Ejs
app.set("view engine", "ejs");
app.use(expressLayouts); //third party mw
app.use(express.static("public")); // Build-in midleware
app.use(express.urlencoded({ extended: true }));

// Konfig Flash
app.use(cookieParser("secret"));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// Halaman Home
app.get("/", (req, res) => {
    const mahasiswa = [{
            nama: "M Fauzan F",
            email: "muh.fauzan.f@gmail.com",
        },
        {
            nama: "MFF",
            email: "muh@gmail.com",
        },
        {
            nama: " F",
            email: "f@gmail.com",
        },
        {
            nama: "uzan F",
            email: "uzan.f@gmail.com",
        },
    ];
    res.render("index", {
        title: "Halaman Home",
        layout: "layouts/main-layout",
        nama: "Fauzan",
        mahasiswa,
    });
});

// Halaman About
app.get("/about", (req, res) => {
    res.render("about", {
        title: "Halaman About",
        layout: "layouts/main-layout",
    });
});

// Halaman Contact
app.get("/contact", async(req, res) => {
    // Contact.find().then((contact) => {
    //     res.send(contact);
    // })

    const contacts = await Contact.find();

    res.render("contact", {
        title: "Halaman Contact",
        layout: "layouts/main-layout",
        contacts,
        msg: req.flash("msg"),
    });
});

// halaman form tambah
app.get("/contact/add", (req, res) => {
    res.render("add-contact", {
        title: "Form Tambah Data Contact",
        layout: "layouts/main-layout",
    });
});

//proses tambah datadata contact
app.post(
    "/contact", [
        body("nama").custom(async(value) => {
            const duplikat = await Contact.findOne({ nama: value });
            if (duplikat) {
                throw new Error("Nama Contact sudah digunakan");
            }
            return true;
        }),
        check("email", "Format email tidak valid").isEmail(),
        check("nohp", "Format nomor HP tidak valid").isMobilePhone("id-ID"),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("add-contact", {
                title: "Form Tambah Data Contact",
                layout: "layouts/main-layout",
                errors: errors.array(),
            });
        } else {
            do {
                Contact.insertMany({
                    nama: req.body.nama[i],
                    nohp: req.body.nohp[i],
                    email: req.body.email[i],
                })
                i++;
            }
            while (i < req.body.nama.length);
            req.flash("msg", "Data Contact berhasil ditambahkan");
            res.redirect("/contact");



        }
    }
);


// proses delete
// app.get("/contact/delete/:nama", async(req, res) => {
//     const contact = await Contact.findOne({ nama: req.params.nama });

//     // jika kontak tidak ada
//     if (!contact) {
//         res.status(404);
//         res.send('<h1> 404 </h1>');

//     } else {
//         Contact.deleteOne({ _id: contact._id }).then((result) => {
//             req.flash("msg", "Data Contact berhasil dihapus");
//             res.redirect("/contact");
//         });
//     }
// });

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash("msg", "Data Contact berhasil dihapus");
        res.redirect("/contact");
    });
})


// halaman form ubah data kontak

app.get("/contact/edit/:nama", async(req, res) => {

    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render("edit-contact", {
        title: "Form Ubah Data Contact",
        layout: "layouts/main-layout",
        contact
    });
});

//proses ubah data
app.put(
    "/contact", [
        body("nama").custom(async(value, { req }) => {
            const duplikat = await Contact.findOne({ nama: value });
            if (value !== req.body.oldNama && duplikat) {
                throw new Error("Nama Contact sudah digunakan");
            }
            return true;
        }),
        check("email", "Format email tidak valid").isEmail(),
        check("nohp", "Format nomor HP tidak valid").isMobilePhone("id-ID"),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("edit-contact", {
                title: "Form Ubah Data Contact",
                layout: "layouts/main-layout",
                errors: errors.array(),
                contact: req.body,
            });
        } else {
            Contact.updateOne({ _id: req.body._id }, {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp,
                }

            }).then((result) => {
                req.flash("msg", "Data Contact berhasil diubah");
                res.redirect("/contact");
            });
        }
    }
);

//halaman detail
app.get("/contact/:nama", async(req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });

    // const contact = findContact(req.params.nama);

    res.render("detail", {
        title: "Halaman Detail Contact",
        layout: "layouts/main-layout",
        contact,
    });
});

app.listen(port, () => {
    console.log(`Mongo Contact App | listening at http://localhost:${port}`);
});