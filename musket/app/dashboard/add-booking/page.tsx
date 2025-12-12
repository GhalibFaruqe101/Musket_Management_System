'use client';

import { useActionState, useState } from 'react';
import { createBooking } from './actions';

const initialState = {
    message: '',
};

export default function AddBookingPage() {
    const [state, formAction, isPending] = useActionState(createBooking, initialState);
    const [costLocked, setCostLocked] = useState(true);
    const [cost, setCost] = useState(100); // Default cost

    const handleUnlockCost = () => {
        const password = prompt("Enter manager password to change cost:");
        if (password === "admin") { // Simple password check
            setCostLocked(false);
        } else {
            alert("Incorrect password");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 flex justify-center items-center font-sans selection:bg-indigo-500/30">
            <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500" />

                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                    New Booking
                </h1>
                <p className="text-neutral-400 mb-8">Enter customer and slot details to create a new reservation.</p>

                {state?.message && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
                        {state.message}
                    </div>
                )}

                <form action={formAction} className="space-y-6">

                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-neutral-300 border-b border-neutral-800 pb-2">Customer Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Phone Number</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="e.g. +1 555 000 0000"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="e.g. john@example.com"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-neutral-300 border-b border-neutral-800 pb-2">Slot Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    required
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Time</label>
                                <input
                                    name="time"
                                    type="time"
                                    required
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all [color-scheme:dark]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-neutral-300 border-b border-neutral-800 pb-2">Booking Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Number of Members</label>
                                <input
                                    name="members"
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2 relative">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex justify-between">
                                    <span>Cost ($)</span>
                                    {costLocked && (
                                        <button type="button" onClick={handleUnlockCost} className="text-indigo-400 hover:text-indigo-300 text-[10px] tracking-normal font-normal">
                                            Unlock to Edit
                                        </button>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        name="cost"
                                        type="number"
                                        value={cost}
                                        onChange={(e) => setCost(Number(e.target.value))}
                                        readOnly={costLocked}
                                        className={`w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:outline-none transition-all ${costLocked ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500/50'
                                            }`}
                                    />
                                    {costLocked && (
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <span className="text-neutral-600">🔒</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative px-6 py-3 w-full bg-neutral-100 hover:bg-white text-neutral-950 font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            <span className="relative z-10">{isPending ? 'Processing...' : 'Confirm Booking'}</span>
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity rounded-xl" />
                        </button>
                        <a href="/dashboard" className="px-6 py-3 rounded-xl border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-all text-center">
                            Cancel
                        </a>
                    </div>

                </form>
            </div>
        </div>
    );
}
