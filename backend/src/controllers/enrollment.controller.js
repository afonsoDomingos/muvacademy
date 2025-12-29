import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import Notification from '../models/Notification.js';
import Log from '../models/Log.js';

// Get my enrollments (for students)
export const getMyEnrollments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = { userId: req.user._id };
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [enrollments, total] = await Promise.all([
            Enrollment.find(query).populate('courseId', 'title image slug priceMZN').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Enrollment.countDocuments(query)
        ]);

        res.json({ success: true, data: { enrollments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar inscrições.' });
    }
};

// Get all enrollments (for admin)
export const getAllEnrollments = async (req, res) => {
    try {
        const { status, courseId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const query = {};
        if (status) query.status = status;
        if (courseId) query.courseId = courseId;

        const sort = {}; sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [enrollments, total] = await Promise.all([
            Enrollment.find(query).populate('userId', 'name email phone').populate('courseId', 'title image priceMZN').populate('approvedBy', 'name').sort(sort).skip(skip).limit(parseInt(limit)),
            Enrollment.countDocuments(query)
        ]);

        res.json({ success: true, data: { enrollments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar inscrições.' });
    }
};

// Get single enrollment
export const getEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id).populate('userId', 'name email phone avatar').populate('courseId', 'title image priceMZN priceUSD').populate('approvedBy', 'name').populate('rejectedBy', 'name');
        if (!enrollment) return res.status(404).json({ success: false, message: 'Inscrição não encontrada.' });

        // Check access
        if (req.user.role === 'cliente' && enrollment.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Acesso negado.' });
        }

        res.json({ success: true, data: { enrollment } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar inscrição.' });
    }
};

// Create enrollment (pre-registration)
export const createEnrollment = async (req, res) => {
    try {
        const { courseId, proofUrl, proofPublicId, paymentMethod, paymentDetails, observations } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Curso não encontrado.' });
        if (!course.published) return res.status(400).json({ success: false, message: 'Este curso não está disponível.' });

        // Check for existing enrollment
        const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
        if (existing) {
            if (existing.status === 'APROVADO') return res.status(400).json({ success: false, message: 'Você já está inscrito neste curso.' });
            if (existing.status === 'PENDENTE') return res.status(400).json({ success: false, message: 'Você já tem uma inscrição pendente neste curso.' });
        }

        const enrollment = await Enrollment.create({ userId: req.user._id, courseId, proofUrl, proofPublicId, paymentMethod, paymentDetails, observations, status: 'PENDENTE' });

        await Log.createLog({ userId: req.user._id, action: 'enrollment_create', description: `Enrollment created for course: ${course.title.pt}`, targetType: 'enrollment', targetId: enrollment._id });
        res.status(201).json({ success: true, message: 'Pré-inscrição realizada! Aguarde a aprovação.', data: { enrollment } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao criar inscrição.' });
    }
};

// Approve enrollment
export const approveEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id).populate('courseId', 'title');
        if (!enrollment) return res.status(404).json({ success: false, message: 'Inscrição não encontrada.' });
        if (enrollment.status !== 'PENDENTE') return res.status(400).json({ success: false, message: 'Esta inscrição não está pendente.' });

        enrollment.status = 'APROVADO';
        enrollment.approvedBy = req.user._id;
        enrollment.approvedAt = new Date();
        enrollment.adminNotes = req.body.adminNotes || '';
        enrollment.startedAt = new Date();
        await enrollment.save();

        // Notify user
        await Notification.createEnrollmentNotification(enrollment.userId, 'enrollment_approved', enrollment.courseId.title, { enrollmentId: enrollment._id, courseId: enrollment.courseId._id });

        await Log.createLog({ userId: req.user._id, action: 'enrollment_approve', description: `Enrollment approved`, targetType: 'enrollment', targetId: enrollment._id });
        res.json({ success: true, message: 'Inscrição aprovada!', data: { enrollment } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao aprovar inscrição.' });
    }
};

// Reject enrollment
export const rejectEnrollment = async (req, res) => {
    try {
        const { rejectionReason, adminNotes } = req.body;
        const enrollment = await Enrollment.findById(req.params.id).populate('courseId', 'title');
        if (!enrollment) return res.status(404).json({ success: false, message: 'Inscrição não encontrada.' });
        if (enrollment.status !== 'PENDENTE') return res.status(400).json({ success: false, message: 'Esta inscrição não está pendente.' });

        enrollment.status = 'REJEITADO';
        enrollment.rejectedBy = req.user._id;
        enrollment.rejectedAt = new Date();
        enrollment.rejectionReason = rejectionReason || '';
        enrollment.adminNotes = adminNotes || '';
        await enrollment.save();

        // Notify user
        await Notification.createEnrollmentNotification(enrollment.userId, 'enrollment_rejected', enrollment.courseId.title, { enrollmentId: enrollment._id, reason: rejectionReason });

        await Log.createLog({ userId: req.user._id, action: 'enrollment_reject', description: `Enrollment rejected`, targetType: 'enrollment', targetId: enrollment._id });
        res.json({ success: true, message: 'Inscrição rejeitada.', data: { enrollment } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao rejeitar inscrição.' });
    }
};

// Update progress
export const updateProgress = async (req, res) => {
    try {
        const { lessonId, completed, watchTime, lastPosition } = req.body;
        const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: req.params.courseId, status: 'APROVADO' });
        if (!enrollment) return res.status(404).json({ success: false, message: 'Inscrição não encontrada.' });

        const progressIndex = enrollment.progress.findIndex(p => p.lessonId.toString() === lessonId);
        if (progressIndex >= 0) {
            if (completed !== undefined) enrollment.progress[progressIndex].completed = completed;
            if (watchTime !== undefined) enrollment.progress[progressIndex].watchTime = watchTime;
            if (lastPosition !== undefined) enrollment.progress[progressIndex].lastPosition = lastPosition;
            if (completed) enrollment.progress[progressIndex].completedAt = new Date();
        } else {
            enrollment.progress.push({ lessonId, completed: completed || false, completedAt: completed ? new Date() : null, watchTime: watchTime || 0, lastPosition: lastPosition || 0 });
        }

        await enrollment.updateProgress();
        await enrollment.save();
        res.json({ success: true, data: { enrollment } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar progresso.' });
    }
};
