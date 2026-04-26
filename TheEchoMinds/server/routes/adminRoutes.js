import express from "express";
import { requireEmployee } from "../middleware/employeeAuth.js";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  adminListProducts,
  adminUpdateProductStock,
} from "../controllers/adminController.js";
import { listHelpCentreTicketsAdmin } from "../controllers/helpCentreController.js";

const router = express.Router();

router.use(requireEmployee);

router.get("/orders", adminListOrders);
router.patch("/orders/:orderId/status", adminUpdateOrderStatus);
router.get("/products", adminListProducts);
router.patch("/products/:slug/stock", adminUpdateProductStock);
router.get("/help-centre-tickets", listHelpCentreTicketsAdmin);

export default router;
