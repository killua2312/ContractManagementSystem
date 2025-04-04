const express = require("express");
const router = express.Router();
const contractController = require("../controllers/contractController");

router.post("/", contractController.createContract);
router.get("/", contractController.getContracts);
router.get("/:id", contractController.getContractById);
router.put("/:id", contractController.updateContract);
router.delete("/:id", contractController.deleteContract);

module.exports = router;
