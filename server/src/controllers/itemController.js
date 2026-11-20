const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const getItems = async (req, res) => {
  try {
    const {
      type, // 'LOST' or 'FOUND'
      status, // 'OPEN', 'CLAIM_PENDING', 'RESOLVED'
      categoryId,
      locationId,
      userId,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNumber - 1) * pageSize;

    const where = {};

    if (userId) {
      where.userId = userId;
    }

    if (type) {
      where.itemType = type.toUpperCase();
    }

    if (status) {
      where.status = status.toUpperCase();
    } else if (!userId) {
      // By default show active items first unless specified or viewing own notices
      where.status = { not: 'EXPIRED' };
    }

    if (categoryId) {
      where.categoryId = parseInt(categoryId, 10);
    }

    if (locationId) {
      where.locationId = parseInt(locationId, 10);
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { brandColor: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [items, totalCount] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          location: true,
          images: {
            select: { id: true, imageUrl: true, isPrimary: true },
          },
          user: {
            select: { id: true, fullName: true, role: true },
          },
          _count: {
            select: { claims: true },
          },
        },
      }),
      prisma.item.count({ where }),
    ]);

    return successResponse(res, 'Items retrieved successfully.', {
      items,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: pageNumber,
        pageSize,
      },
    });
  } catch (error) {
    console.error('getItems error:', error);
    return errorResponse(res, 'Failed to fetch items.', 500, error.message);
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        location: true,
        images: true,
        user: {
          select: { id: true, fullName: true, email: true, phone: true, role: true },
        },
        claims: {
          include: {
            claimant: {
              select: { id: true, fullName: true, email: true, studentId: true, phone: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!item) {
      return errorResponse(res, 'Item not found.', 404);
    }

    // Privacy shielding: If requester is not the item owner and not security/admin,
    // mask the finder/owner's phone number and exclude other users' claims
    const isOwner = req.user && req.user.id === item.userId;
    const isStaffOrAdmin = req.user && (req.user.role === 'ADMIN' || req.user.role === 'SECURITY_STAFF');

    const sanitizedItem = { ...item };
    if (!isOwner && !isStaffOrAdmin) {
      if (sanitizedItem.user) {
        sanitizedItem.user = {
          id: sanitizedItem.user.id,
          fullName: sanitizedItem.user.fullName,
          role: sanitizedItem.user.role,
        };
      }
      // Only show user's own claim if logged in
      if (req.user) {
        sanitizedItem.claims = item.claims.filter((c) => c.claimantId === req.user.id);
      } else {
        sanitizedItem.claims = [];
      }
    }

    return successResponse(res, 'Item details retrieved.', sanitizedItem);
  } catch (error) {
    console.error('getItemById error:', error);
    return errorResponse(res, 'Failed to retrieve item.', 500, error.message);
  }
};

const createItem = async (req, res) => {
  try {
    const {
      itemType, // 'LOST' or 'FOUND'
      categoryId,
      locationId,
      title,
      description,
      brandColor,
      incidentDate,
      custodyType,
      custodyDetails,
      proofQuestion,
    } = req.body;

    if (!itemType || !categoryId || !locationId || !title || !description || !incidentDate) {
      return errorResponse(
        res,
        'Item type, category, location, title, description, and incident date are required.',
        400
      );
    }

    // Process uploaded images
    let imagesData = [];
    if (req.files && req.files.length > 0) {
      imagesData = req.files.map((file, idx) => ({
        imageUrl: `/uploads/${file.filename}`,
        isPrimary: idx === 0,
      }));
    }

    const newItem = await prisma.item.create({
      data: {
        userId: req.user.id,
        categoryId: parseInt(categoryId, 10),
        locationId: parseInt(locationId, 10),
        itemType: itemType.toUpperCase() === 'FOUND' ? 'FOUND' : 'LOST',
        title: title.trim(),
        description: description.trim(),
        brandColor: brandColor ? brandColor.trim() : null,
        incidentDate: new Date(incidentDate),
        custodyType: custodyType === 'AT_SECURITY_DESK' ? 'AT_SECURITY_DESK' : 'WITH_FINDER',
        custodyDetails: custodyDetails ? custodyDetails.trim() : null,
        proofQuestion: proofQuestion ? proofQuestion.trim() : null,
        images: {
          create: imagesData,
        },
      },
      include: {
        category: true,
        location: true,
        images: true,
      },
    });

    return successResponse(res, 'Item reported successfully!', newItem, 201);
  } catch (error) {
    console.error('createItem error:', error);
    return errorResponse(res, 'Failed to report item.', 500, error.message);
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, brandColor, status, custodyType, custodyDetails } = req.body;

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Item not found.', 404);
    }

    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'SECURITY_STAFF') {
      return errorResponse(res, 'Unauthorized to update this item.', 403);
    }

    const updated = await prisma.item.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(brandColor !== undefined && { brandColor: brandColor ? brandColor.trim() : null }),
        ...(status && { status }),
        ...(custodyType && { custodyType }),
        ...(custodyDetails !== undefined && { custodyDetails }),
      },
      include: {
        category: true,
        location: true,
        images: true,
      },
    });

    return successResponse(res, 'Item updated successfully.', updated);
  } catch (error) {
    console.error('updateItem error:', error);
    return errorResponse(res, 'Failed to update item.', 500, error.message);
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse(res, 'Item not found.', 404);
    }

    if (existing.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return errorResponse(res, 'Unauthorized to delete this item.', 403);
    }

    await prisma.item.delete({ where: { id } });

    return successResponse(res, 'Item deleted successfully.');
  } catch (error) {
    console.error('deleteItem error:', error);
    return errorResponse(res, 'Failed to delete item.', 500, error.message);
  }
};

const getPotentialMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return errorResponse(res, 'Item not found.', 404);
    }

    // Look for opposite type (if LOST, look for FOUND; if FOUND, look for LOST)
    const targetType = item.itemType === 'LOST' ? 'FOUND' : 'LOST';

    const matches = await prisma.item.findMany({
      where: {
        id: { not: item.id },
        itemType: targetType,
        categoryId: item.categoryId,
        status: { in: ['OPEN', 'CLAIM_PENDING'] },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        location: true,
        images: true,
      },
    });

    return successResponse(res, 'Potential matches retrieved.', matches);
  } catch (error) {
    console.error('getPotentialMatches error:', error);
    return errorResponse(res, 'Failed to find matches.', 500, error.message);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getPotentialMatches,
};
