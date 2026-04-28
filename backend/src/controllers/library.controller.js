const prisma = require('../config/prisma');

const getBooks = async (req, res) => {
    try {
        const { institution_id } = req.query;
        const result = await prisma.books.findMany({
            where: { institution_id: parseInt(institution_id) },
            include: { book_issues: true }
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, isbn, category, total_copies, institution_id } = req.body;
        const result = await prisma.books.create({
            data: {
                title, author, isbn, category,
                total_copies: parseInt(total_copies),
                available_copies: parseInt(total_copies),
                institution_id: parseInt(institution_id)
            }
        });
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await prisma.books.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.books.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const issueBook = async (req, res) => {
    try {
        const { book_id, user_id, due_date } = req.body;
        
        const book = await prisma.books.findUnique({ where: { id: parseInt(book_id) } });
        if (book.available_copies <= 0) {
            return res.status(400).json({ error: 'No copies available' });
        }

        const result = await prisma.$transaction([
            prisma.book_issues.create({
                data: {
                    book_id: parseInt(book_id),
                    user_id: parseInt(user_id),
                    due_date: new Date(due_date),
                    status: 'Issued'
                }
            }),
            prisma.books.update({
                where: { id: parseInt(book_id) },
                data: { available_copies: book.available_copies - 1 }
            })
        ]);
        
        res.status(201).json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const { issue_id } = req.body;
        const issue = await prisma.book_issues.findUnique({ where: { id: parseInt(issue_id) } });
        
        const result = await prisma.$transaction([
            prisma.book_issues.update({
                where: { id: parseInt(issue_id) },
                data: { return_date: new Date(), status: 'Returned' }
            }),
            prisma.books.update({
                where: { id: issue.book_id },
                data: { available_copies: { increment: 1 } }
            })
        ]);
        
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getBooks, createBook, updateBook, deleteBook, issueBook, returnBook };
