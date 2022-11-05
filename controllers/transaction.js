const createHttpError = require('http-errors')
const { Transaction, User, Category } = require('../database/models')
const { ErrorObject } = require('../helpers/error')
const { endpointResponse } = require('../helpers/success')
const { catchAsync } = require('../helpers/catchAsync')



module.exports = {
    createTransaction: catchAsync(async (req, res, next) => {
        try {
            const { description, amount, userId, categoryId } = req.body
            const idUser = await User.findByPk(userId)
            const idCategory = await Category.findByPk(categoryId)
            if (!idUser) throw new ErrorObject('invalid id user!')
            if (!idCategory) throw new ErrorObject('invalid id Category!')
            const newTransaction = await Transaction.create({
                description,
                amount,
                userId: idUser.id,
                categoryId: idCategory.id
            })
            endpointResponse({
                res,
                message: 'transaction completed successfully',
                body: newTransaction,
            })
        } catch (error) {
            const httpError = createHttpError(
                error.statusCode, `[Error retrieving index] - [transaction - POST]: ${error.message}`,
            )
            next(httpError)
        }
    }),
    getTransactions: catchAsync(async (req, res, next) => {
        try {
            const response = await Transaction.findAll()
            if (!response) {
                throw new ErrorObject("Cant do the action", 500)
            }
            endpointResponse({
                res,
                message: "Transactions retrieved successfully",
                body: response
            })
        } catch (error) {
            const httpError = createHttpError(
                error.statusCode, `[Error retrieving index] - [index - GET]: ${error.message}`,
                `[Error retrieving index] - [transactions - GET]: ${error.message}`,
            )
            next(httpError)
        }
    }),
    deleteTransaction: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params
            const response = await Transaction.destroy({ where: { id } })
            if (!response) {
                throw new ErrorObject("the id doest not exit", 500)
            }
            endpointResponse({
                res,
                message: "Transactions deleted retrieved successfully",
                body: response
            })
        } catch (error) {
            const httpError = createHttpError(
                error.statusCode, `[Error retrieving index] - [index - GET]: ${error.message}`,
                `[Error retrieving index] - [transactions - GET]: ${error.message}`,
            )
            next(httpError)
        }
    })
}