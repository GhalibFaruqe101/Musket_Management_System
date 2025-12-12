"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./dashboard.css";
import { SlotStatus } from "@prisma/client";

// --- Types ---
export interface DashboardSlot {
    id: string;
    time: string;
    date: string;
    status: SlotStatus;
    bookedByName?: string | null;
}

export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    payment: {
        total: number;
        advance: number;
        due: number;
    };
}

interface DashboardClientProps {
    slots: DashboardSlot[];
    users: DashboardUser[];
}

export default function DashboardClient({ slots, users }: DashboardClientProps) {
    const [filter, setFilter] = useState<SlotStatus | "All">("All");

    // --- Derived State ---
    const filteredSlots = slots.filter(
        (slot) => filter === "All" || slot.status === filter
    );

    const stats = {
        booked: slots.filter((s) => s.status === "Booked").length,
        open: slots.filter((s) => s.status === "Open").length,
        cancelled: slots.filter((s) => s.status === "Cancelled").length,
        totalRevenue: users.reduce((acc, user) => acc + user.payment.total, 0),
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="title">Admin Dashboard</h1>
                    <p className="subtitle">Overview of slots, bookings, and customer payments.</p>
                </div>
                <Link
                    href="/dashboard/add-booking"
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#4f46e5', // Indigo-600
                        color: 'white',
                        borderRadius: '0.75rem',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                    }}
                >
                    + New Booking
                </Link>
            </header>

            {/* Statistics Cards */}
            <section className="stats-grid">
                <div className="stat-card">
                    <span className="stat-title">Booked Slots</span>
                    <span className="stat-value">{stats.booked}</span>
                    <span className="stat-trend trend-up">High demand</span>
                </div>
                <div className="stat-card">
                    <span className="stat-title">Open Slots</span>
                    <span className="stat-value">{stats.open}</span>
                    <span className="stat-trend">Available for booking</span>
                </div>
                <div className="stat-card">
                    <span className="stat-title">Cancelled</span>
                    <span className="stat-value">{stats.cancelled}</span>
                    <span className="stat-trend trend-down">Needs attention</span>
                </div>
                <div className="stat-card">
                    <span className="stat-title">Total Revenue</span>
                    <span className="stat-value">${stats.totalRevenue.toLocaleString()}</span>
                    <span className="stat-trend trend-up">+12% from last week</span>
                </div>
            </section>

            {/* Slots Section */}
            <section className="section-container">
                <h2 className="h2-title">Slot Management</h2>

                {/* Filter */}
                <div className="filter-section">
                    {["All", "Booked", "Open", "Cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as SlotStatus | "All")}
                            className={`filter-btn ${filter === status ? "active" : ""}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Slots Table */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Booked By</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSlots.length > 0 ? (
                                filteredSlots.map((slot) => (
                                    <tr key={slot.id}>
                                        <td>{slot.date}</td>
                                        <td>{slot.time}</td>
                                        <td>
                                            <span className={`status-chip status-${slot.status.toLowerCase()}`}>
                                                {slot.status}
                                            </span>
                                        </td>
                                        <td>{slot.bookedByName || "-"}</td>
                                        <td>
                                            <button style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer", fontWeight: 600 }}>
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8" }}>
                                        No slots found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Users Section */}
            <section className="section-container">
                <h2 className="h2-title">Customer Details & Payments</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Customer Info</th>
                                <th>Total Amount</th>
                                <th>Advance Paid</th>
                                <th>Due Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 600, color: "#1e293b" }}>{user.name}</span>
                                            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="payment-amount">${user.payment.total}</td>
                                    <td className="payment-advance">${user.payment.advance}</td>
                                    <td className="payment-due">
                                        {user.payment.due > 0 ? `$${user.payment.due}` : "Paid"}
                                    </td>
                                    <td>
                                        {user.payment.due === 0 ? (
                                            <span className="status-chip status-open">Fully Paid</span>
                                        ) : (
                                            <span className="status-chip status-booked">Partial</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
