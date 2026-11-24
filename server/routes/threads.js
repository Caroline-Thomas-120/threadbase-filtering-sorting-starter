
import { Router } from "express";
import prisma from "../prisma/client.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search, sort } = req.query;

    // Build the database search condition
    const where = search
      ? {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    // Build the database sorting condition
    const orderBy =
      sort === "oldest"
        ? { createdAt: "asc" }
        : { createdAt: "desc" };

    // Get threads directly from the database
    const threads = await prisma.thread.findMany({
      where,
      orderBy,
      include: {
        author: { select: { name: true, avatarUrl: true } },
        _count: { select: { comments: true } },
      },
    });

    res.json({ threads });
  } catch (error) {
    next(error);
  }
});

export default router;
