const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
    email: { type: String, default: '' },
    name: { type: String, required: true},
    lastName: { type: String, default: '' },
    phone: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const ContactModel = mongoose.model('contact', contactSchema);

function Contact(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
}

Contact.prototype = {
    get hasError() {
        return this.errors.length > 0
    }
}

Contact.prototype.register = async function() {
    this.checkFields();
    if(this.hasError) return;

    this.contact = await ContactModel.create(this.body);
}

Contact.prototype.checkFields = function () {        
    this.cleanUp();
        
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email invalid.');

    if(!this.body.name) this.errors.push('Name is required.');

    if(!this.body.email && !this.body.phone) {
        this.errors.push('Contact needs a phone or an email.');
    }
}

Contact.prototype.cleanUp = function () {
    for (const key in this.body) {            
        if(typeof(this.body[key]) !== 'string') {                
            this.body[key] = '';
        }
    }

    this.body = {
        email: this.body.email,
        name: this.body.name,
        lastName: this.body.lastName,
        phone: this.body.phone
    };
}

Contact.prototype.update = async function(id) {
    if(typeof(id) !== 'string') return;

    this.checkFields();
    if(this.hasError) return;

    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Static methods
Contact.findById = async function(id) {
    if(typeof(id) !== 'string') return;

    const contact = await ContactModel.findById(id);
    return contact;
}

Contact.getAll = async function() {
    const contacts = await ContactModel.find()
                                       .sort({ createdAt: -1 });
    return contacts;
}

Contact.deleteById = async function(id) {
    if(typeof(id) !== 'string') return;

    const contact = await ContactModel.findOneAndDelete({ _id: id });
    return contact;
}

module.exports = Contact;