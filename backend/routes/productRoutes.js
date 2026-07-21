import express from 'express';
import { createProducts, deleteProducts, getAllProducts, getSingleProduct, updateProducts} from '../controller/productController.js';
const router = express.Router();
import { roleBasedAuth, verifyUserAuth } from '../middleware/verifyUserAuth.js';


//routes
router.route("/products")
.get(getAllProducts)

router.route("/admin/product/create").post(verifyUserAuth, roleBasedAuth("admin"), createProducts)

router.route("/admin/product/:id")
.put(verifyUserAuth, roleBasedAuth("admin"), updateProducts)
.delete(verifyUserAuth, roleBasedAuth("admin"), deleteProducts)

router.route("/product/:id").get(getSingleProduct)

export default router;