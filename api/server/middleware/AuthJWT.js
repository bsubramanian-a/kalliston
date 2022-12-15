const express = require("express");
const database = require('../src/models');
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    console.log("Authorization : ",req.headers.authorization);
    
    let token = req.headers.authorization.split(' ')[1];
    console.log("Verified Token : ",token);
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.coachId = decoded.id;
        next();
    });
};

module.exports = { verifyToken };
