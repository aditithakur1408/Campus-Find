const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });
    return successResponse(res, 'Categories retrieved.', categories);
  } catch (error) {
    console.error('getCategories error:', error);
    return errorResponse(res, 'Failed to fetch categories.', 500, error.message);
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: [{ buildingName: 'asc' }, { zoneFloor: 'asc' }],
    });
    return successResponse(res, 'Locations retrieved.', locations);
  } catch (error) {
    console.error('getLocations error:', error);
    return errorResponse(res, 'Failed to fetch locations.', 500, error.message);
  }
};

const getStats = async (req, res) => {
  try {
    const [totalLost, totalFound, resolvedItems, pendingClaims, activeUsers] = await Promise.all([
      prisma.item.count({ where: { itemType: 'LOST' } }),
      prisma.item.count({ where: { itemType: 'FOUND' } }),
      prisma.item.count({ where: { status: 'RESOLVED' } }),
      prisma.claim.count({ where: { claimStatus: 'PENDING' } }),
      prisma.user.count(),
    ]);

    return successResponse(res, 'Platform statistics retrieved.', {
      totalLost,
      totalFound,
      resolvedItems,
      pendingClaims,
      activeUsers,
      recoveryRate: totalLost + totalFound > 0 ? Math.round((resolvedItems / (totalLost + totalFound)) * 100) : 0,
    });
  } catch (error) {
    console.error('getStats error:', error);
    return errorResponse(res, 'Failed to fetch stats.', 500, error.message);
  }
};

const getActivityLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: {
          select: { id: true, fullName: true, email: true, role: true, studentId: true },
        },
      },
    });

    return successResponse(res, 'Activity logs retrieved.', logs);
  } catch (error) {
    console.error('getActivityLogs error:', error);
    return errorResponse(res, 'Failed to fetch activity logs.', 500, error.message);
  }
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return successResponse(res, 'Notifications retrieved.', notifications);
  } catch (error) {
    console.error('getNotifications error:', error);
    return errorResponse(res, 'Failed to fetch notifications.', 500, error.message);
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notification.updateMany({
      where: { id, userId: req.user.id },
      data: { isRead: true },
    });
    return successResponse(res, 'Notification marked as read.');
  } catch (error) {
    console.error('markNotificationRead error:', error);
    return errorResponse(res, 'Failed to update notification.', 500, error.message);
  }
};

module.exports = {
  getCategories,
  getLocations,
  getStats,
  getActivityLogs,
  getNotifications,
  markNotificationRead,
};
