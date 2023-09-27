const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

module.exports = {
    express: express,
    mongoose: mongoose,
    multer: multer,
    crypto: crypto,
    jwt: jwt,
    nodemailer: nodemailer
};