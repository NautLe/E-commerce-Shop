import Address from "../models/addressModel.js"
import ErrorHandler from "../utils/handleError.js"
import handleAsyncError from "../middleware/handleAsyncError.js"

// Get all addresses of logged-in user
export const getMyAddresses = handleAsyncError(async (req, res, next) => {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 })
    res.status(200).json({
        success: true,
        addresses
    })
})

// Create new address
export const createAddress = handleAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    req.body.fullName = req.body.fullName || req.body.name
    req.body.phoneNumber = req.body.phoneNumber || req.body.phone
    req.body.addressLine = req.body.addressLine || req.body.address
    req.body.postalCode = req.body.postalCode || req.body.pinCode

    if (req.body.isDefault) {
        await Address.updateMany({ user: req.user.id }, { isDefault: false })
    }

    const address = await Address.create(req.body)
    res.status(201).json({
        success: true,
        address
    })
})

// Update address
export const updateAddress = handleAsyncError(async (req, res, next) => {
    let address = await Address.findById(req.params.id)
    if (!address) {
        return next(new ErrorHandler("Address not found", 404))
    }
    if (address.user.toString() !== req.user.id.toString()) {
        return next(new ErrorHandler("Not authorized to update this address", 403))
    }

    req.body.fullName = req.body.fullName || req.body.name || address.fullName
    req.body.phoneNumber = req.body.phoneNumber || req.body.phone || address.phoneNumber
    req.body.addressLine = req.body.addressLine || req.body.address || address.addressLine
    req.body.postalCode = req.body.postalCode || req.body.pinCode || address.postalCode

    if (req.body.isDefault) {
        await Address.updateMany({ user: req.user.id }, { isDefault: false })
    }

    address = await Address.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true
    })

    res.status(200).json({
        success: true,
        address
    })
})

// Delete address
export const deleteAddress = handleAsyncError(async (req, res, next) => {
    const address = await Address.findById(req.params.id)
    if (!address) {
        return next(new ErrorHandler("Address not found", 404))
    }
    if (address.user.toString() !== req.user.id.toString()) {
        return next(new ErrorHandler("Not authorized to delete this address", 403))
    }

    await Address.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Address deleted successfully"
    })
})