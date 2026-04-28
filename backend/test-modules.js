console.log("Starting test-startup...");
try {
    const express = require('express');
    console.log("SUCCESS: Express loaded.");
    const cors = require('cors');
    console.log("SUCCESS: Cors loaded.");
    const { PrismaClient } = require('@prisma/client');
    console.log("SUCCESS: @prisma/client loaded.");
    const prisma = new PrismaClient();
    console.log("SUCCESS: PrismaClient instantiated.");
} catch (err) {
    console.error("FAILURE:", err.message);
    console.error(err.stack);
}
console.log("End of test.");
