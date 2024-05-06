import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (method === "GET") {
        res.json(await Category.find().populate('parent'));
    }
    
    if (method === 'POST') {
        const {name,parentCategory,properties} = req.body;
        const category = await Category.create({
          name,
          parent: parentCategory || undefined,
          properties,
        });
        res.json(category);
      }

    if (method === "PUT") {
        const { name, parentCategory, _id, properties} = req.body;
        const updateFields = {
            name,
            parent: parentCategory === "" ? null : parentCategory,
            properties,
        };
        const category = await Category.findByIdAndUpdate(_id, updateFields, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }

    if (method === "DELETE") {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    }
}