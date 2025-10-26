import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { analyticsService } from '../services/analyticsService';
import { categoryService } from '../services/categoryService';
import { CategoryAnalytics, ExpenseSummary, DateAnalytics, Category, SubCategory } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const Analytics: React.FC = () => {
    const [summary, setSummary] = useState<ExpenseSummary>({ total_amount: 0, count: 0, avg_amount: 0 });
    const [categoryData, setCategoryData] = useState<CategoryAnalytics[]>([]);
    const [dateData, setDateData] = useState<DateAnalytics[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        category: '',
        sub_category: '',
        start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end_date: format(new Date(), 'yyyy-MM-dd'),
        grouping: 'day' as 'day' | 'week' | 'month' | 'year',
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [filters]);

    const loadData = async () => {
        try {
            const [categoriesData, subCategoriesData] = await Promise.all([
                categoryService.getCategories(),
                categoryService.getSubCategories(),
            ]);
            setCategories(categoriesData);
            setSubCategories(subCategoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const params = {
                category: filters.category || undefined,
                sub_category: filters.sub_category || undefined,
                start_date: filters.start_date || undefined,
                end_date: filters.end_date || undefined,
            };

            const [summaryData, categoryAnalytics, dateAnalytics] = await Promise.all([
                analyticsService.getSummary(params),
                analyticsService.getByCategory(params),
                analyticsService.getByDate({ ...params, grouping: filters.grouping }),
            ]);

            setSummary(summaryData);
            setCategoryData(categoryAnalytics);
            setDateData(dateAnalytics);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            sub_category: '',
            start_date: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
            end_date: format(new Date(), 'yyyy-MM-dd'),
            grouping: 'day',
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
                <h2>Analytics</h2>

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

                        <div className="form-group">
                            <label>Group By</label>
                            <select
                                value={filters.grouping}
                                onChange={(e) => setFilters({ ...filters, grouping: e.target.value as any })}
                            >
                                <option value="day">Day</option>
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                                <option value="year">Year</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={clearFilters} className="btn btn-link">
                        Clear Filters
                    </button>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Spent</div>
                        <div className="stat-value">₹{summary.total_amount.toFixed(2)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Expenses</div>
                        <div className="stat-value">{summary.count}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Average Amount</div>
                        <div className="stat-value">₹{summary.avg_amount.toFixed(2)}</div>
                    </div>
                </div>

                {categoryData.length > 0 && (
                    <div className="chart-section">
                        <h3>Spending by Category</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="total_amount"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={(entry) => `${entry.category}: ₹${entry.total_amount.toFixed(2)}`}
                                    >
                                        {categoryData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="category-list">
                            {categoryData.map((item, index) => (
                                <div key={item.category} className="category-item">
                                    <div className="category-info">
                                        <div
                                            className="category-color"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        ></div>
                                        <span className="category-name">{item.category}</span>
                                    </div>
                                    <div className="category-stats">
                                        <span className="category-amount">₹{item.total_amount.toFixed(2)}</span>
                                        <span className="category-count">({item.count} items)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {dateData.length > 0 && (
                    <div className="chart-section">
                        <h3>Spending Over Time</h3>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={dateData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="total_amount" fill="#3b82f6" name="Total Amount" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Analytics;
