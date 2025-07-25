import { Request, Response } from 'express';
import { Material } from '../models/Material';

export const getAllMaterials = async (req: Request, res: Response) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    let material = await Material.findOne({ name });
    if (material) return res.status(200).json(material);
    material = new Material({ name });
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create material', details: err });
  }
}; 