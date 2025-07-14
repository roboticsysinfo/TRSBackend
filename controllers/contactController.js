const Contact = require('../models/Contact');

const response = (success, message, data = null) => ({
    success,
    message,
    data,
});

exports.createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.json(response(true, "Contact created successfully", contact));
    } catch (err) {
        res.status(500).json(response(false, "Failed to create contact", err.message));
    }
};

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(response(true, "Contacts fetched successfully", contacts));
    } catch (err) {
        res.status(500).json(response(false, "Failed to fetch contacts", err.message));
    }
};

exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json(response(false, "Contact not found"));
        res.json(response(true, "Contact fetched successfully", contact));
    } catch (err) {
        res.status(500).json(response(false, "Failed to fetch contact", err.message));
    }
};

exports.updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) return res.status(404).json(response(false, "Contact not found"));
        res.json(response(true, "Contact updated successfully", contact));
    } catch (err) {
        res.status(500).json(response(false, "Failed to update contact", err.message));
    }
};

exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json(response(false, "Contact not found"));
        res.json(response(true, "Contact deleted successfully", contact));
    } catch (err) {
        res.status(500).json(response(false, "Failed to delete contact", err.message));
    }
};
