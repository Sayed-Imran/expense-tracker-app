import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Filter, X } from 'lucide-react';
import Layout from '../components/Layout';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';
import { Expense, ExpenseCreate, Category, SubCategory } from '../types';
import { format } from 'date-fns';

const Expenses: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    // Form state
    const [formData, setFormData] = useState<ExpenseCreate>({
        title: '',
        category: '',
        sub_category: '',
        amount: 0,
        date: format(new Date(), 'yyyy-MM-dd'),
        comments: '',
    });

    // Filter state
    const [filters, setFilters] = useState({
        category: '',
        sub_category: '',
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [expensesData, categoriesData, subCategoriesData] = await Promise.all([
                expenseService.getExpenses(filters),
                categoryService.getCategories(),
                categoryService.getSubCategories(),
            ]);
            setExpenses(expensesData);
            setCategories(categoriesData);
            setSubCategories(subCategoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExpense) {
                await expenseService.updateExpense(editingExpense._id, formData);
            } else {
                await expenseService.createExpense(formData);
            }
            setShowModal(false);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Failed to save expense:', error);
        }
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setFormData({
            title: expense.title,
            category: expense.category,
            sub_category: expense.sub_category || '',
            amount: expense.amount,
            date: format(new Date(expense.date), 'yyyy-MM-dd'),
            comments: expense.comments || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await expenseService.deleteExpense(id);
                loadData();
            } catch (error) {
                console.error('Failed to delete expense:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            sub_category: '',
            amount: 0,
            date: format(new Date(), 'yyyy-MM-dd'),
            comments: '',
        });
        setEditingExpense(null);
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            sub_category: '',
            start_date: '',
            end_date: '',
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h2>My Expenses</h2>
                    <div className="page-actions">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn btn-secondary"
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="btn btn-primary"
                        >
                            <Plus size={18} />
                            Add Expense
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="filters-panel">
                        <div className="filters-grid">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Sub Category</label>
                                <select
                                    value={filters.sub_category}
                                    onChange={(e) => setFilters({ ...filters, sub_category: e.target.value })}
                                >
                                    <option value="">All Sub Categories</option>
                                    {subCategories.map((sub) => (
                                        <option key={sub._id} value={sub.name}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={filters.start_date}
                                    onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={filters.end_date}
                                    onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                                />
                            </div>
                        </div>
                        <button onClick={clearFilters} className="btn btn-link">
                            Clear Filters
                        </button>
                    </div>
                )}

                <div className="expenses-list">
                    {expenses.length === 0 ? (
                        <div className="empty-state">
                            <p>No expenses found. Start by adding your first expense!</p>
                        </div>
                    ) : (
                        expenses.map((expense) => (
                            <div key={expense._id} className="expense-card">
                                <div className="expense-main">
                                    <div className="expense-info">
                                        <h3>{expense.title}</h3>
                                        <div className="expense-meta">
                                            <span className="badge badge-primary">{expense.category}</span>
                                            {expense.sub_category && (
                                                <span className="badge badge-secondary">{expense.sub_category}</span>
                                            )}
                                            <span className="expense-date">
                                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                        {expense.comments && (
                                            <p className="expense-comments">{expense.comments}</p>
                                        )}
                                    </div>
                                    <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>
                                </div>
                                <div className="expense-actions">
                                    <button
                                        onClick={() => handleEdit(expense)}
                                        className="btn-icon"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className="btn-icon btn-danger"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="btn-icon"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="title">Title *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="category">Category *</label>
                                        <input
                                            type="text"
                                            id="category"
                                            list="categories"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        />
                                        <datalist id="categories">
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat.name} />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="sub_category">Sub Category</label>
                                        <input
                                            type="text"
                                            id="sub_category"
                                            list="subcategories"
                                            value={formData.sub_category}
                                            onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
                                        />
                                        <datalist id="subcategories">
                                            {subCategories.map((sub) => (
                                                <option key={sub._id} value={sub.name} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="amount">Amount *</label>
                                        <input
                                            type="number"
                                            id="amount"
                                            step="0.01"
                                            min="0"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="date">Date *</label>
                                        <input
                                            type="date"
                                            id="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="comments">Comments</label>
                                    <textarea
                                        id="comments"
                                        rows={3}
                                        value={formData.comments}
                                        onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                    />
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingExpense ? 'Update' : 'Add'} Expense
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Expenses;
