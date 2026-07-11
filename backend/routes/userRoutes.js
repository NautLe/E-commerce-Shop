import express from "express";
import { requestPasswordReset, userLogin, userLogout, userRegister, getUserDetail, resetPassword, updatePassword, updateProfile } from "../controller/userController.js";
import { verifyUserAuth } from "../middleware/verifyUserAuth.js";

    const router = express.Router();


    router.route("/register").post(userRegister);
    router.route("/login").post(userLogin);
    router.route("/logout").post(userLogout);
    router.route("/password/forgot").post(requestPasswordReset);
    router.route("/reset/:token").post(resetPassword);
    router.route("/profile").post(verifyUserAuth, getUserDetail);
    router.route("/password/update").post(verifyUserAuth, updatePassword);
    router.route("/profile/update").post(verifyUserAuth, updateProfile);






    export default router;