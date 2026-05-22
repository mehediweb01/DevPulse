import type { Request, Response } from "express";

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
};

export default notFoundHandler;
