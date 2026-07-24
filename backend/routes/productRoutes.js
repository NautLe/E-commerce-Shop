import express from 'express';
import { createProducts, createReview, deleteProducts, deleteReview, getAdminProducts, getAllProducts, getProductReview, getSingleProduct, updateProducts} from '../controller/productController.js';
const router = express.Router();
import { roleBasedAuth, verifyUserAuth } from '../middleware/verifyUserAuth.js';


//routes
router.route("/products")
.get(getAllProducts)

router.route("/admin/products")
.get(verifyUserAuth,roleBasedAuth("admin"),getAdminProducts)
router.route("/admin/product/create").post(verifyUserAuth, roleBasedAuth("admin"), createProducts)

router.route("/admin/product/:id")
.put(verifyUserAuth, roleBasedAuth("admin"), updateProducts)
.delete(verifyUserAuth, roleBasedAuth("admin"), deleteProducts)
router.route("/product/:id").get(getSingleProduct)
router.route("/product/review/:id").put(verifyUserAuth,createReview)
router.route("/product/reviews/:id").get(getProductReview).delete(verifyUserAuth,deleteReview)


export default router;