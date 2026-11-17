const crypto = require('crypto');
const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const submitClaim = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { proofAnswer, additionalDetails } = req.body;

    if (!proofAnswer || proofAnswer.trim() === '') {
      return errorResponse(res, 'Proof of ownership answer is required.', 400);
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return errorResponse(res, 'Item not found.', 404);
    }

    if (item.userId === req.user.id) {
      return errorResponse(res, 'You cannot claim an item you reported yourself.', 400);
    }

    if (item.status === 'RESOLVED') {
      return errorResponse(res, 'This item has already been claimed and resolved.', 400);
    }

    // Check if user already submitted a pending claim on this item
    const existingClaim = await prisma.claim.findFirst({
      where: {
        itemId,
        claimantId: req.user.id,
        claimStatus: 'PENDING',
      },
    });

    if (existingClaim) {
      return errorResponse(res, 'You already have a pending claim on this item.', 409);
    }

    let attachmentUrl = null;
    if (req.file) {
      attachmentUrl = `/uploads/${req.file.filename}`;
    }

    const claim = await prisma.claim.create({
      data: {
        itemId,
        claimantId: req.user.id,
        proofAnswer: proofAnswer.trim(),
        additionalDetails: additionalDetails ? additionalDetails.trim() : null,
        proofAttachmentUrl: attachmentUrl,
        claimStatus: 'PENDING',
      },
      include: {
        claimant: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    // Update item status to CLAIM_PENDING
    await prisma.item.update({
      where: { id: itemId },
      data: { status: 'CLAIM_PENDING' },
    });

    // Notify item finder/reporter
    await prisma.notification.create({
      data: {
        userId: item.userId,
        title: 'New Ownership Claim Submitted',
        message: `${req.user.fullName} has submitted a claim for "${item.title}". Review their proof answer.`,
        actionLink: `/items/${item.id}`,
      },
    });

    return successResponse(res, 'Claim submitted successfully!', claim, 201);
  } catch (error) {
    console.error('submitClaim error:', error);
    return errorResponse(res, 'Failed to submit claim.', 500, error.message);
  }
};

const getClaimsForItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return errorResponse(res, 'Item not found.', 404);
    }

    // Only owner of the item or admin / security staff can view claims
    if (item.userId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'SECURITY_STAFF') {
      return errorResponse(res, 'Unauthorized to view claims for this item.', 403);
    }

    const claims = await prisma.claim.findMany({
      where: { itemId },
      include: {
        claimant: {
          select: { id: true, fullName: true, email: true, studentId: true, phone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(res, 'Claims retrieved.', claims);
  } catch (error) {
    console.error('getClaimsForItem error:', error);
    return errorResponse(res, 'Failed to fetch claims.', 500, error.message);
  }
};

const updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return errorResponse(res, 'Invalid status. Must be APPROVED or REJECTED.', 400);
    }

    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: { item: true, claimant: true },
    });

    if (!claim) {
      return errorResponse(res, 'Claim not found.', 404);
    }

    const isOwner = claim.item.userId === req.user.id;
    const isStaffOrAdmin = req.user.role === 'ADMIN' || req.user.role === 'SECURITY_STAFF';

    if (!isOwner && !isStaffOrAdmin) {
      return errorResponse(res, 'Unauthorized to update this claim.', 403);
    }

    let rawOtp = null;
    let otpHash = null;

    if (status === 'APPROVED') {
      // Generate a 6-digit secure handover OTP
      rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpHash = crypto.createHash('sha256').update(rawOtp).digest('hex');

      // Update item with OTP hash
      await prisma.item.update({
        where: { id: claim.itemId },
        data: {
          handoverOtpHash: otpHash,
          status: 'CLAIM_PENDING',
        },
      });

      // Notify claimant with OTP
      await prisma.notification.create({
        data: {
          userId: claim.claimantId,
          title: 'Claim Approved! Handover Code Generated',
          message: `Your claim for "${claim.item.title}" was approved! Your Handover Code is: ${rawOtp}. Present this code when meeting in person.`,
          actionLink: `/items/${claim.itemId}`,
        },
      });
    }

    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: {
        claimStatus: status,
        resolvedAt: status === 'APPROVED' ? new Date() : null,
      },
      include: {
        claimant: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    return successResponse(res, `Claim ${status.toLowerCase()} successfully.`, {
      claim: updatedClaim,
      ...(rawOtp && { handoverOtp: rawOtp }), // Returned for confirmation
    });
  } catch (error) {
    console.error('updateClaimStatus error:', error);
    return errorResponse(res, 'Failed to update claim.', 500, error.message);
  }
};

const verifyHandoverOtp = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { otp } = req.body;

    if (!otp || otp.toString().trim().length !== 6) {
      return errorResponse(res, 'Valid 6-digit OTP code is required.', 400);
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return errorResponse(res, 'Item not found.', 404);
    }

    const isOwner = item.userId === req.user.id;
    const isStaffOrAdmin = req.user.role === 'ADMIN' || req.user.role === 'SECURITY_STAFF';

    if (!isOwner && !isStaffOrAdmin) {
      return errorResponse(res, 'Unauthorized to verify handover for this item.', 403);
    }

    if (!item.handoverOtpHash) {
      return errorResponse(res, 'No handover OTP has been generated for this item yet.', 400);
    }

    const inputHash = crypto.createHash('sha256').update(otp.toString().trim()).digest('hex');

    if (inputHash !== item.handoverOtpHash) {
      return errorResponse(res, 'Incorrect verification code. Please check with claimant.', 400);
    }

    // Mark item as RESOLVED and claim as COMPLETED
    const [updatedItem] = await prisma.$transaction([
      prisma.item.update({
        where: { id: itemId },
        data: {
          status: 'RESOLVED',
          handoverOtpHash: null, // Clear used OTP
        },
      }),
      prisma.claim.updateMany({
        where: { itemId, claimStatus: 'APPROVED' },
        data: { claimStatus: 'COMPLETED', resolvedAt: new Date() },
      }),
      prisma.auditLog.create({
        data: {
          itemId,
          performedBy: req.user.id,
          action: 'ITEM_HANDOVER_VERIFIED',
          metadata: { timestamp: new Date(), verifiedByRole: req.user.role },
        },
      }),
    ]);

    return successResponse(res, 'Item handover verified! Marked as RESOLVED.', updatedItem);
  } catch (error) {
    console.error('verifyHandoverOtp error:', error);
    return errorResponse(res, 'Failed to verify handover.', 500, error.message);
  }
};

module.exports = {
  submitClaim,
  getClaimsForItem,
  updateClaimStatus,
  verifyHandoverOtp,
};
