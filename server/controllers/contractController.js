const contractService = require("../services/contractService");
const {
  contractSchema,
  querySchema,
  queryIdSchema,
  updateSchema,
} = require("../utils/contractValidation");

const contractController = {
  createContract: async (req, res) => {
    try {
      // Validate the request body with Joi
      const { error, value } = contractSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      // Create the contrat in the database
      const newContract = await contractService.createContract(value);
      res.status(201).json(newContract);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        res.status(400).json({
          error: "A contract with this client and title already exists.",
        });
      } else {
        console.error("Error in contractController", error);
        res.status(500).json({ error: "Internal server Error" });
      }
    }
  },

  getContracts: async (req, res) => {
    try {
      // Validate the request body with Joi
      const { error, value } = querySchema.validate(req.query);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const result = await contractService.getContracts(value);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error in getContracts controller:", error);
      res.status(500).json({ error: "Internal server Error" });
    }
  },

  getContractById: async (req, res) => {
    try {
      // Validate
      const { error, value } = queryIdSchema.validate(req.params);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const result = await contractService.getContractById(value.id);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error in getContractById controller:", error);
      res.status(500).json({ error: "Internal server Error" });
    }
  },

  updateContract: async (req, res) => {
    try {
      // Validate
      const queryValidation = queryIdSchema.validate(req.params);
      if (queryValidation.error)
        return res
          .status(400)
          .json({ error: queryValidation.error.details[0].message });

      const bodyValidation = updateSchema.validate(req.body);
      if (bodyValidation.error)
        return res
          .status(400)
          .json({ error: bodyValidation.error.details[0].message });

      const result = await contractService.updateContract(
        queryValidation.value,
        bodyValidation.value,
      );

      res.status(201).json(result);
    } catch (error) {
      console.error("Error in updateContract controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteContract: async (req, res) => {
    try {
      // Validate
      const { error, value } = queryIdSchema.validate(req.params);

      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const result = await contractService.deleteContract(value.id);

      res.status(201).json(result);
    } catch (error) {
      console.error("Error in deleteContract controller:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = contractController;
