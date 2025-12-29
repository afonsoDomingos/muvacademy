import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import Log from '../models/Log.js';

// Get all modules for a course
export const getModulesByCourse = async (req, res) => {
    try {
        const modules = await Module.find({ courseId: req.params.courseId }).sort({ order: 1 }).lean();
        for (let module of modules) {
            module.lessons = await Lesson.find({ moduleId: module._id }).sort({ order: 1 }).lean();
        }
        res.json({ success: true, data: { modules } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar módulos.' });
    }
};

// Get single module
export const getModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id).populate('courseId', 'title');
        if (!module) return res.status(404).json({ success: false, message: 'Módulo não encontrado.' });
        const lessons = await Lesson.find({ moduleId: module._id }).sort({ order: 1 });
        res.json({ success: true, data: { module, lessons } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar módulo.' });
    }
};

// Create module
export const createModule = async (req, res) => {
    try {
        const { courseId, title, description, order, isPublished } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Curso não encontrado.' });

        let moduleOrder = order;
        if (!moduleOrder) {
            const lastModule = await Module.findOne({ courseId }).sort({ order: -1 });
            moduleOrder = lastModule ? lastModule.order + 1 : 1;
        }

        const module = await Module.create({ courseId, title, description, order: moduleOrder, isPublished: isPublished !== false });
        await Log.createLog({ userId: req.user._id, action: 'module_create', description: `Module created: ${title.pt}`, targetType: 'module', targetId: module._id });
        res.status(201).json({ success: true, message: 'Módulo criado!', data: { module } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao criar módulo.' });
    }
};

// Update module
export const updateModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ success: false, message: 'Módulo não encontrado.' });

        const { title, description, order, isPublished } = req.body;
        if (title) module.title = title;
        if (description) module.description = description;
        if (order !== undefined) module.order = order;
        if (isPublished !== undefined) module.isPublished = isPublished;

        await module.save();
        res.json({ success: true, message: 'Módulo atualizado!', data: { module } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar módulo.' });
    }
};

// Reorder modules
export const reorderModules = async (req, res) => {
    try {
        const { moduleOrders } = req.body;
        for (const item of moduleOrders) {
            await Module.findByIdAndUpdate(item.moduleId, { order: item.order });
        }
        res.json({ success: true, message: 'Módulos reordenados!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao reordenar módulos.' });
    }
};

// Delete module
export const deleteModule = async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ success: false, message: 'Módulo não encontrado.' });

        await Lesson.deleteMany({ moduleId: module._id });
        await module.deleteOne();

        const remaining = await Module.find({ courseId: module.courseId }).sort({ order: 1 });
        for (let i = 0; i < remaining.length; i++) {
            remaining[i].order = i + 1;
            await remaining[i].save();
        }

        res.json({ success: true, message: 'Módulo deletado!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao deletar módulo.' });
    }
};
