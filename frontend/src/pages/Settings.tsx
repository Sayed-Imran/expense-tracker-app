import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { categoryService } from '../services/categoryService';
import { Category, SubCategory } from '../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Settings: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [categoriesData, subCategoriesData] = await Promise.all([
                categoryService.getCategories(),
                categoryService.getSubCategories(),
            ]);
            setCategories(categoriesData);
            setSubCategories(subCategoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory._id, categoryName);
            } else {
                await categoryService.createCategory(categoryName);
            }
            setShowCategoryModal(false);
            setCategoryName('');
            setEditingCategory(null);
            loadData();
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoryService.deleteCategory(id);
                loadData();
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
    };

    const handleSaveSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSubCategory) {
                await categoryService.updateSubCategory(editingSubCategory._id, subCategoryName);
            } else {
                await categoryService.createSubCategory(subCategoryName);
            }
            setShowSubCategoryModal(false);
            setSubCategoryName('');
            setEditingSubCategory(null);
            loadData();
        } catch (error) {
            console.error('Failed to save subcategory:', error);
        }
    };

    const handleDeleteSubCategory = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            try {
                await categoryService.deleteSubCategory(id);
                loadData();
            } catch (error) {
                console.error('Failed to delete subcategory:', error);
            }
        }
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
                <h2>Settings</h2>

                <div className="settings-section">
                    <div className="section-header">
                        <h3>Categories</h3>
                        <button
                            onClick={() => {
                                setCategoryName('');
                                setEditingCategory(null);
                                setShowCategoryModal(true);
                            }}
                            className="btn btn-primary"
                        >
                            <Plus size={18} />
                            Add Category
                        </button>
                    </div>

                    <div className="items-list">
                        {categories.length === 0 ? (
                            <p className="empty-text">No categories yet. Add your first category!</p>
                        ) : (
                            categories.map((category) => (
                                <div key={category._id} className="item-card">
                                    <span className="item-name">{category.name}</span>
                                    <div className="item-actions">
                                        <button
                                            onClick={() => {
                                                setCategoryName(category.name);
                                                setEditingCategory(category);
                                                setShowCategoryModal(true);
                                            }}
                                            className="btn-icon"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(category._id)}
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
                </div>

                <div className="settings-section">
                    <div className="section-header">
                        <h3>Sub Categories</h3>
                        <button
                            onClick={() => {
                                setSubCategoryName('');
                                setEditingSubCategory(null);
                                setShowSubCategoryModal(true);
                            }}
                            className="btn btn-primary"
                        >
                            <Plus size={18} />
                            Add Sub Category
                        </button>
                    </div>

                    <div className="items-list">
                        {subCategories.length === 0 ? (
                            <p className="empty-text">No subcategories yet. Add your first subcategory!</p>
                        ) : (
                            subCategories.map((subCategory) => (
                                <div key={subCategory._id} className="item-card">
                                    <span className="item-name">{subCategory.name}</span>
                                    <div className="item-actions">
                                        <button
                                            onClick={() => {
                                                setSubCategoryName(subCategory.name);
                                                setEditingSubCategory(subCategory);
                                                setShowSubCategoryModal(true);
                                            }}
                                            className="btn-icon"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSubCategory(subCategory._id)}
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
                </div>

                {showCategoryModal && (
                    <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                                <button onClick={() => setShowCategoryModal(false)} className="btn-icon">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSaveCategory} className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="categoryName">Category Name *</label>
                                    <input
                                        type="text"
                                        id="categoryName"
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingCategory ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showSubCategoryModal && (
                    <div className="modal-overlay" onClick={() => setShowSubCategoryModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}</h3>
                                <button onClick={() => setShowSubCategoryModal(false)} className="btn-icon">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSaveSubCategory} className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="subCategoryName">Sub Category Name *</label>
                                    <input
                                        type="text"
                                        id="subCategoryName"
                                        value={subCategoryName}
                                        onChange={(e) => setSubCategoryName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={() => setShowSubCategoryModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingSubCategory ? 'Update' : 'Add'}
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

export default Settings;
