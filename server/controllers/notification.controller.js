import Notification from "../models/notification.model.js";

export const getNotifications = async (req,res)=>{
    try{

        const notifications=await Notification.find({
            user:req.user.id
        }).sort({
            createdAt:-1
        });

        res.status(200).json({
            success:true,
            count:notifications.length,
            notifications
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
}

export const markAsRead=async(req,res)=>{
    try{

        const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user.id
});

        if(!notification){
            return res.status(404).json({
                success:false,
                message:"Notification not found"
            });
        }

        notification.isRead=true;

        await notification.save();

        res.status(200).json({
            success:true,
            message:"Notification marked as read"
        });

    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
}