// D:\TravelbucketList\backend\models\Destination.js

const mongoose = require('mongoose');

// 1. Schema for individual expense items (nested structure)
const ExpenseSchema = new mongoose.Schema({
    flights: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    transportation: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
    others: { type: Number, default: 0 },
}, { _id: false }); // We don't need a separate ID for the expenses object itself

// 2. Main Destination Schema
const DestinationSchema = new mongoose.Schema({
    // User field to link the destination to a user (used 'user123_testing_id' for CRUD testing)
    user: { 
        type: String, 
        required: true,
    },
    // Core details
    name: { type: String, required: true, trim: true },
    plannedDate: { type: Date },
    
    // Total calculated budget
    totalBudget: { type: Number, default: 0 },
    
    // Status
    visited: { type: Boolean, default: false },
    
    // Nested expense breakdown using the ExpenseSchema
    expenses: { type: ExpenseSchema, required: true },
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// 3. Export the model
// CRITICAL: Ensure this export name 'Destination' matches the capitalized file name
module.exports = mongoose.model('Destination', DestinationSchema);