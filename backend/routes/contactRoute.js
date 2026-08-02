import express from "express"
import {
    createContact,
    getAllContacts,
    deleteContact
} from "../controller/contactController.js"

const router = express.Router()

router.route("/contact/new").post(createContact)
router.route("/admin/contacts").get(getAllContacts)
router.route("/admin/contact/:id").delete(deleteContact)

export default router
