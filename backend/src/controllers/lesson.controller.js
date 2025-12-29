import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';
import Course from '../models/Course.js';
import Log from '../models/Log.js';

// Get lessons by module
export const getLessonsByModule = async (req, res) => {
    try {
        const lessons = await Lesson.find({ moduleId: req.params.moduleId }).sort({ order: 1 });
        res.json({ success: true, data: { lessons } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar aulas.' });
    }
};

// Get single lesson (full details for enrolled users)
export const getLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate({ path: 'moduleId', populate: { path: 'courseId' } });
        if (!lesson) return res.status(404).json({ success: false, message: 'Aula não encontrada.' });

        const courseId = lesson.moduleId.courseId._id;
        const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId, status: 'APROVADO' });

        // If not enrolled and not admin, hide material URLs
        if (!enrollment && !['admin', 'superadmin'].includes(req.user.role)) {
            if (!lesson.isFree) {
                return res.status(403).json({ success: false, message: 'Você precisa estar inscrito para acessar esta aula.' });
            }
        }

        res.json({ success: true, data: { lesson, isEnrolled: !!enrollment } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar aula.' });
    }
};

// Create lesson
export const createLesson = async (req, res) => {
    try {
        const { moduleId, title, description, order, isFree, isPublished } = req.body;
        const module = await Module.findById(moduleId);
        if (!module) return res.status(404).json({ success: false, message: 'Módulo não encontrado.' });

        let lessonOrder = order;
        if (!lessonOrder) {
            const lastLesson = await Lesson.findOne({ moduleId }).sort({ order: -1 });
            lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
        }

        const lesson = await Lesson.create({ moduleId, title, description, order: lessonOrder, isFree: isFree || false, isPublished: isPublished !== false, materials: [] });
        await Log.createLog({ userId: req.user._id, action: 'lesson_create', description: `Lesson created: ${title.pt}`, targetType: 'lesson', targetId: lesson._id });
        res.status(201).json({ success: true, message: 'Aula criada!', data: { lesson } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao criar aula.' });
    }
};

// Update lesson
export const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ success: false, message: 'Aula não encontrada.' });

        const fields = ['title', 'description', 'order', 'isFree', 'isPublished', 'duration'];
        fields.forEach(f => { if (req.body[f] !== undefined) lesson[f] = req.body[f]; });

        await lesson.save();
        res.json({ success: true, message: 'Aula atualizada!', data: { lesson } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar aula.' });
    }
};

// Add material to lesson
export const addMaterial = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate({ path: 'moduleId', populate: { path: 'courseId' } });
        if (!lesson) return res.status(404).json({ success: false, message: 'Aula não encontrada.' });

        const { title, description, type, fileType, fileUrl, cloudinaryPublicId, mimeType, fileSize, duration, isDownloadable } = req.body;

        const order = lesson.materials.length + 1;
        lesson.materials.push({ title, description, type, fileType, fileUrl, cloudinaryPublicId, mimeType, fileSize, duration, isDownloadable: isDownloadable !== false, order });

        await lesson.save();

        // Notify enrolled users about new material
        const course = lesson.moduleId.courseId;
        const enrollments = await Enrollment.find({ courseId: course._id, status: 'APROVADO' });
        for (const enroll of enrollments) {
            await Notification.createMaterialNotification(enroll.userId, course.title, lesson.title, { courseId: course._id, lessonId: lesson._id });
        }

        await Log.createLog({ userId: req.user._id, action: 'material_add', description: `Material added to lesson: ${lesson.title.pt}`, targetType: 'lesson', targetId: lesson._id });
        res.json({ success: true, message: 'Material adicionado!', data: { lesson } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao adicionar material.' });
    }
};

// Remove material from lesson
export const removeMaterial = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ success: false, message: 'Aula não encontrada.' });

        lesson.materials = lesson.materials.filter(m => m._id.toString() !== req.params.materialId);
        lesson.materials.forEach((m, i) => m.order = i + 1);

        await lesson.save();
        res.json({ success: true, message: 'Material removido!', data: { lesson } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao remover material.' });
    }
};

// Delete lesson
export const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ success: false, message: 'Aula não encontrada.' });

        await lesson.deleteOne();

        const remaining = await Lesson.find({ moduleId: lesson.moduleId }).sort({ order: 1 });
        for (let i = 0; i < remaining.length; i++) {
            remaining[i].order = i + 1;
            await remaining[i].save();
        }

        res.json({ success: true, message: 'Aula deletada!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao deletar aula.' });
    }
};

// Mark lesson as complete
export const markComplete = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('moduleId');
        if (!lesson) return res.status(404).json({ success: false, message: 'Aula não encontrada.' });

        const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: lesson.moduleId.courseId, status: 'APROVADO' });
        if (!enrollment) return res.status(403).json({ success: false, message: 'Você não está inscrito neste curso.' });

        const progressIndex = enrollment.progress.findIndex(p => p.lessonId.toString() === lesson._id.toString());
        if (progressIndex >= 0) {
            enrollment.progress[progressIndex].completed = true;
            enrollment.progress[progressIndex].completedAt = new Date();
        } else {
            enrollment.progress.push({ lessonId: lesson._id, completed: true, completedAt: new Date() });
        }

        await enrollment.updateProgress();
        await enrollment.save();

        res.json({ success: true, message: 'Aula marcada como concluída!', data: { enrollment } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao marcar aula.' });
    }
};
