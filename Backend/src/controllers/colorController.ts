import { Request, Response } from 'express';
import { Color } from '../models/Color';

export const getAllColors = async (req: Request, res: Response) => {
  try {
    const colors = await Color.find();
    res.json(colors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch colors' });
  }
};

export const createColor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    let color = await Color.findOne({ name });
    if (color) return res.status(200).json(color);
    color = new Color({ name });
    await color.save();
    res.status(201).json(color);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create color', details: err });
  }
}; 