const { Op } = require("sequelize");
const { Contract } = require("../models");
const socket = require("../socket");

const createContract = async (contractData) => {
  try {
    // Create the new Contract
    const newContract = await Contract.create(contractData);

    // Emit socket event
    const io = socket.getIo();
    io.emit("newContract", newContract);

    return newContract;
  } catch (error) {
    console.error("Error in CreateContract:", error);
    throw error;
  }
};

const getContracts = async (filters) => {
  const { status, searchTerm, page = 1, limit = 10 } = filters;

  // Pagination parse
  const parsedLimit = parseInt(limit, 10);
  const offset = (parseInt(page, 10) - 1) * parsedLimit;

  const whereConditions = {};

  // status
  if (status) {
    whereConditions.status = status;
  }

  // SearchTerm
  if (searchTerm && searchTerm.trim() !== "") {
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        searchTerm,
      )
    ) {
      whereConditions.id = searchTerm;
    } else {
      whereConditions.client = { [Op.iLike]: `%${searchTerm}%` };
    }
  }

  try {
    const { rows: results, count: total } = await Contract.findAndCountAll({
      where: whereConditions,
      limit: parsedLimit,
      offset,
      order: [["updatedAt", "DESC"]], // Sort by updatedAt in descending order
    });

    return { total, page: parseInt(page, 10), limit: parsedLimit, results };
  } catch (error) {
    console.error("Error in getContracts:", error);
    throw error;
  }
};

const getContractById = async (id) => {
  try {
    const contract = await Contract.findOne({
      where: { id },
    });

    if (!contract) {
      throw new Error("Contract record not found");
    }

    return contract;
  } catch (error) {
    console.error("Error in getContractById:", error);
    throw error;
  }
};

const updateContract = async (params, body) => {
  try {
    const { id } = params;
    const { status, data } = body;

    const contract = await Contract.findOne({ where: { id } });

    if (!contract) {
      throw new Error("Contract record not found");
    }

    const [numOfRows, updatedRows] = await Contract.update(
      { status: status, data: data },
      { where: { id: id }, returning: true },
    );

    // Emit Socket Event
    const io = socket.getIo();
    io.emit("contractUpdate", updatedRows);

    return { result: updatedRows };
  } catch (error) {
    console.error("Error in updateContract:", error);
    throw error;
  }
};

const deleteContract = async (id) => {
  try {
    const contract = await Contract.findOne({ where: { id } });

    if (!contract) {
      throw new Error("Contract record not found");
    }

    // Delete contract
    await contract.destroy();

    // Emit Socket Event
    const io = socket.getIo();
    io.emit("contractDelete", { deletedId: contract.id });

    return { success: true, deletedId: contract.id };
  } catch (error) {
    console.error("Error in deleteContract:", error);
    throw error;
  }
};

module.exports = {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
};
