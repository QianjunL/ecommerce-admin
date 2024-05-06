// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Product.findOne({_id: req.query.id}));
        } else {
            res.json(await Product.find());
        }
    }

    if (method === 'POST') {
        const { title, desc, price, image, category, properties } = req.body;
        const product = await Product.create({
            title, 
            desc, 
            price, 
            image, 
            category: category === '' ? null : category,
            properties
        })
        res.json(product);
    }

    if (method === 'PUT') {
        const { 
            title, 
            desc, 
            price, 
            image, 
            category, 
            properties,
            _id } = req.body;
        const updateFields = {
            title,
            desc,
            price,
            image,
            category: category === '' ? null : category,
            properties: properties || {},
        };
        await Product.updateOne({_id}, updateFields);
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
  