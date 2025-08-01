import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import dotenv from "dotenv";
import {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPaymentRequest,
} from "pg-sdk-node";

dotenv.config();

const router = express.Router();

router.post("/create-order", (req, res) => {});

export default router;
