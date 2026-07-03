import express from 'express';
import { createProducts, deleteProducts, getAllProducts, getSingleProduct, updateProducts} from '../controller/productController.js';
const router = express.Router();


//routes
router.route("/products")
.get(getAllProducts)
.post(createProducts)
router.route("/product/:id")
.put(updateProducts)
.delete(deleteProducts)
.get(getSingleProduct)

export default router;