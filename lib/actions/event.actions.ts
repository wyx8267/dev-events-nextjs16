'use server';

import Event from "@/database/event.model";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectDB();

        const event = await Event.findOne({ slug }).lean();
        if (!event) return [];

        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        }).lean();

        // 转成可跨 Server/Client 边界传递的普通对象
        return JSON.parse(JSON.stringify(similarEvents));
    } catch {
        return []
    }
}