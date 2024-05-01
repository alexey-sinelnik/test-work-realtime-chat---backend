import { Response } from 'express';
import mongoose from 'mongoose';
import { IGetUserAuthInfoRequest } from '../../common/interfaces/request';
import Conversation from '../../models/conversation';
import Message from '../../models/messages';
import { getReceiverSocketId, io } from '../../socket';

export const sendMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId: mongoose.Types.ObjectId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);

    io.to(receiverSocketId).emit('newMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId: mongoose.Types.ObjectId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate('messages');

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
