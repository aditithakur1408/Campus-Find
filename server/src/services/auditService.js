const prisma = require('../config/db');

const logAction = async ({ userId, action, metadata = {}, itemId = null }) => {
  try {
    return await prisma.auditLog.create({
      data: {
        performedBy: userId,
        action,
        metadata,
        itemId,
      },
    });
  } catch (error) {
    console.error(`Audit logging failed for action [${action}]:`, error.message);
    return null;
  }
};

module.exports = {
  logAction,
};
