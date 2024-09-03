const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Upload, User } = require('./schema');

const app = express();
const port = 3000;
app.listen(port)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/g2c')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));

    app.post('/upload', async (req, res) => {
        const upload = new Upload(req.body);
    
        await Upload.find({ email: upload.email, category: upload.category, item: upload.item })
            .then(result => {
                if (result.length > 0) {
                    const exelement = result[0];
                    console.log(exelement._id)
                    console.log(upload.quantity)
                    Upload.updateOne({_id:  exelement._id}, { $inc: { quantity: upload.quantity } })
                    .then(() => {
                        res.json({success: true, message: 'Item quantity updated successfully' });
                    })
                    } else {
                    console.log('no result');
                    upload.save()
                        .then(() => res.json({ success: true }))
                        .catch(err => {
                            res.status(500).json({ success: false, message: 'Error saving the upload.' });
                        });
                }
            })
            .catch(err => {
                console.error('Error finding the upload:', err);
                res.status(500).json({ success: false, message: 'Error finding the upload.' });
            });
    });
    
app.post('/signup', (req, res) => {
    const { username, email } = req.body;
    User.findOne({ $or: [{ username: username, email: email }] })
        .then((exuser) => {
            if (!exuser) {
                const user = new User(req.body);
                user.save()
                    .then(() => {
                        res.json({ message: "Signed up successfully", alert: "success" })
                    })
                    .catch((err) => {
                        console.log(err.message)
                    }
                    )
            }
            else
                // res.status(400).send({ message: 'Username or email already exists' });
                res.json({ message: "User already exists!", alert: "danger" }).status(400)
        })

})

app.post('/login', (req, res) => {
    const { email, password } = new User(req.body);
    User.findOne({ email: email, password: password })
        .then((user) => {
            if (user)
                res.json({ message: "Logged in successfully!", alert: "success" });
            else
                return User.findOne({ email: email })
                    .then((user) => {
                        if (user) res.json({ message: "Password incorrect", alert: "danger" });
                        else res.json({ message: "Username not found...", alert: "danger" });
                    })
        })
})

app.post('/store', async (req, res) => {
    try {
        const {email} = req.body;
        console.log("Email to find:", email);  
        const data = await Upload.find({email: email});
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/store', async (req, res) => {
    try {
        const data = await Upload.find();
        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send('Error fetching data');
    }
});
