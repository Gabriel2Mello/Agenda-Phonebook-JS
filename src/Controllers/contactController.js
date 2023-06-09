const Contact = require('../Models/contactModel');

exports.index = (req, res) => {
    res.render('contact', {
        contact: {}
    });
};

exports.register = async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.register();
    
        if(contact.hasError) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contact'));
            return;
        }
    
        req.flash('success', 'Contact added with success!');
        req.session.save(() => res.redirect('/'));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.contact = async (req, res) => {
    if(!req.params.id) return res.render('404');
    
    const contact = await Contact.findById(req.params.id);    
    if(!contact) return res.render('404');

    res.render('contact', { contact });
};

exports.update = async (req, res) => {
    try {
        if(!req.params.id) return res.render('404');

        const contact = new Contact(req.body);
        await contact.update(req.params.id);
    
        if(contact.hasError) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect(`/contact/${req.params.id}`));
            return;
        }
    
        req.flash('success', 'Contact updated with success!');
        req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
};

exports.delete = async (req, res) => {
    try {
        if(!req.params.id) return res.render('404');
    
        const contact = await Contact.deleteById(req.params.id);    
        if(!contact) return res.render('404');
    
        req.flash('success', 'Contact deleted with success!');
        req.session.save(() => res.redirect('/'));
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}