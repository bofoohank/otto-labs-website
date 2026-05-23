import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const messageSchema = new mongoose.Schema(
  {
    senderRole: {
      type: String,
      enum: ["Member", "Mod", "Admin", "Bot", "System"],
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    senderName: {
      type: String,
      default: "",
    },

    senderAvatar: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      trim: true,
      default: "",
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    readByStaff: {
      type: Boolean,
      default: false,
    },

    readByMember: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const chatConversationSchema = new mongoose.Schema(
  {
    ticketCode: {
  type: String,
  unique: true,
  index: true,
  default: () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `OTTO-${random}`;
  },
},

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: false,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["waiting", "answered", "closed"],
      default: "waiting",
    },

    unreadForStaff: {
      type: Number,
      default: 0,
    },

    unreadForMember: {
      type: Number,
      default: 0,
    },

    lastCustomerMessageAt: {
      type: Date,
      default: null,
    },

    lastStaffMessageAt: {
      type: Date,
      default: null,
    },

    botRepliedAt: {
      type: Date,
      default: null,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ChatConversation ||
  mongoose.model("ChatConversation", chatConversationSchema);