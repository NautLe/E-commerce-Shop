import express from "express";
import { requestPasswordReset, userLogin, userLogout, userRegister, getUserDetail, resetPassword, updatePassword, updateProfile, getUserProfile, getSingleUser, updateUserRole, deleteUser } from "../controller/userController.js";
import { roleBasedAuth, verifyUserAuth } from "../middleware/verifyUserAuth.js";

    const router = express.Router();


    router.route("/register").post(userRegister);
    router.route("/login").post(userLogin);
    router.route("/logout").post(userLogout);
    router.route("/password/forgot").post(requestPasswordReset);
    router.route("/reset/:token").post(resetPassword);
    router.route("/profile").get(verifyUserAuth, getUserDetail);
    router.route("/password/update").put(verifyUserAuth, updatePassword);
    router.route("/profile/update").put(verifyUserAuth, updateProfile);
    router.route("/admin/users").get(verifyUserAuth, roleBasedAuth("admin"), getUserProfile);
    router.route("/admin/user/:id")
    .get(verifyUserAuth, roleBasedAuth("admin"), getSingleUser)
    .put(verifyUserAuth, roleBasedAuth("admin"), updateUserRole)
    .delete(verifyUserAuth, roleBasedAuth("admin"), deleteUser)










    export default router;