import express from "express"
import {
    getMyAddresses,
    createAddress,
    updateAddress,
    deleteAddress
} from "../controller/addressController.js"
import { verifyUserAuth } from "../middleware/verifyUserAuth.js"

const router = express.Router()

router.route("/addresses").get(verifyUserAuth, getMyAddresses)
router.route("/address/new").post(verifyUserAuth, createAddress)
router.route("/address/:id")
    .put(verifyUserAuth, updateAddress)
    .delete(verifyUserAuth, deleteAddress)

export default router