import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    prn:{
        type:String,
        default:""
    },

    rollNumber:{
        type:String,
        default:""
    },

    branch:{
        type:String,
        default:""
    },

    year:{
        type:String,
        default:""
    },

    cgpa:{
        type:Number,
        default:0
    },

    phone:{
        type:String,
        default:""
    },

    address:{
        type:String,
        default:""
    },

    linkedin:{
        type:String,
        default:""
    },

    github:{
        type:String,
        default:""
    },

    portfolio:{
        type:String,
        default:""
    },

    skills:[
        {
            type:String
        }
    ],

    resume:{
        url:String,
        public_id:String
    },

    profilePicture:{
        url:String,
        public_id:String
    },

    savedJobs:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Job"
        }
    ],

    profileCompleted:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
});

export default mongoose.model("Student",studentSchema);