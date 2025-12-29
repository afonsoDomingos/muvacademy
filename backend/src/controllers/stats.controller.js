import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Log from '../models/Log.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalCourses, totalEnrollments, pendingEnrollments, approvedEnrollments, recentLogs] = await Promise.all([
            User.countDocuments({ role: 'cliente' }),
            Course.countDocuments({ published: true }),
            Enrollment.countDocuments(),
            Enrollment.countDocuments({ status: 'PENDENTE' }),
            Enrollment.countDocuments({ status: 'APROVADO' }),
            Log.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email')
        ]);

        // Enrollments by status
        const enrollmentsByStatus = await Enrollment.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Enrollments per month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const enrollmentsPerMonth = await Enrollment.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Top courses by enrollment
        const topCourses = await Enrollment.aggregate([
            { $match: { status: 'APROVADO' } },
            { $group: { _id: '$courseId', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
            { $unwind: '$course' },
            { $project: { _id: 1, count: 1, 'course.title': 1, 'course.image': 1 } }
        ]);

        res.json({
            success: true,
            data: {
                summary: { totalUsers, totalCourses, totalEnrollments, pendingEnrollments, approvedEnrollments },
                enrollmentsByStatus: enrollmentsByStatus.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
                enrollmentsPerMonth,
                topCourses,
                recentLogs
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas.' });
    }
};

// Get user stats (for student dashboard)
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const [enrollments, completedCourses] = await Promise.all([
            Enrollment.find({ userId, status: 'APROVADO' }).populate('courseId', 'title image'),
            Enrollment.countDocuments({ userId, status: 'APROVADO', overallProgress: 100 })
        ]);

        const inProgress = enrollments.filter(e => e.overallProgress > 0 && e.overallProgress < 100).length;
        const avgProgress = enrollments.length > 0 ? Math.round(enrollments.reduce((sum, e) => sum + e.overallProgress, 0) / enrollments.length) : 0;

        res.json({
            success: true,
            data: {
                totalEnrolled: enrollments.length,
                inProgress,
                completed: completedCourses,
                avgProgress,
                courses: enrollments.map(e => ({ course: e.courseId, progress: e.overallProgress, startedAt: e.startedAt, completedAt: e.completedAt }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas.' });
    }
};

// Get logs (for superadmin)
export const getLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;
        const query = {};

        if (action) query.action = action;
        if (userId) query.userId = userId;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [logs, total] = await Promise.all([
            Log.find(query).populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
            Log.countDocuments(query)
        ]);

        res.json({ success: true, data: { logs, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar logs.' });
    }
};
