import { Router } from "express";
import {
  getSiteVisits,
  incrementSiteVisits,
} from "../controllers/analytics.controller";

const router = Router();

router.get("/visits", getSiteVisits);
router.post("/visits/increment", incrementSiteVisits);

export default router;
