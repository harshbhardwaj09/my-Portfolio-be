import { Request, Response } from "express";
import SiteStat from "../models/siteStat";

const SITE_VISIT_KEY = "site_visits_total";

export const getSiteVisits = async (_req: Request, res: Response) => {
  const stat = await SiteStat.findOne({ key: SITE_VISIT_KEY });
  return res.json({ count: stat?.count ?? 0 });
};

export const incrementSiteVisits = async (_req: Request, res: Response) => {
  const stat = await SiteStat.findOneAndUpdate(
    { key: SITE_VISIT_KEY },
    { $inc: { count: 1 } },
    { new: true, upsert: true },
  );

  return res.json({ count: stat.count });
};
