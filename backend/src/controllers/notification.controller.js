import Notification from '../models/Notification.js';

// Get my notifications
export const getMyNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly } = req.query;
        const query = { userId: req.user._id };
        if (unreadOnly === 'true') query.read = false;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Notification.countDocuments(query),
            Notification.countDocuments({ userId: req.user._id, read: false })
        ]);

        res.json({ success: true, data: { notifications, unreadCount, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar notificações.' });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
        if (!notification) return res.status(404).json({ success: false, message: 'Notificação não encontrada.' });

        notification.read = true;
        notification.readAt = new Date();
        await notification.save();

        res.json({ success: true, data: { notification } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao marcar notificação.' });
    }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id, read: false }, { $set: { read: true, readAt: new Date() } });
        res.json({ success: true, message: 'Todas notificações marcadas como lidas.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao marcar notificações.' });
    }
};

// Delete notification
export const deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true, message: 'Notificação deletada.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao deletar notificação.' });
    }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ userId: req.user._id, read: false });
        res.json({ success: true, data: { count } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao contar notificações.' });
    }
};
