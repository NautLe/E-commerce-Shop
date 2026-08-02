import Contact from "../models/contactModel.js"
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"
import { sendEmail } from "../utils/sendEmail.js"

// Create new contact message (User sends message & triggers Email notification)
export const createContact = handleAsyncError(async (req, res, next) => {
    const { name, email, subject, message } = req.body

    const contact = await Contact.create({
        name,
        email,
        subject: subject || "New Contact Message",
        message
    })

    // Try sending email notification to the store email
    try {
        const targetEmail = process.env.NODEMAILER_EMAIL || "hello@mocha.store"
        await sendEmail({
            email: targetEmail,
            subject: `Mocha Support ${name}: ${subject || "You have a New Message"}`,
            message: `You received a new contact message on MOCHA store:\n\nSender Name: ${name}\nSender Email: ${email}\n\nMessage:\n${message}`
        })
    } catch (err) {
        console.error("Contact email notification failed:", err.message)
    }

    res.status(201).json({
        success: true,
        message: "Your message has been sent successfully",
        contact
    })
})

// Get all contact messages (Admin)
export const getAllContacts = handleAsyncError(async (req, res, next) => {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.status(200).json({
        success: true,
        contacts
    })
})

// Delete contact message (Admin)
export const deleteContact = handleAsyncError(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
        return next(new ErrorHandler("Contact message not found", 404))
    }

    await Contact.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Contact message deleted successfully"
    })
})
