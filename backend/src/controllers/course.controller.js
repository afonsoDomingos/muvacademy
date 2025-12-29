import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import Log from '../models/Log.js';

/**
 * @desc    Get all courses (with filters)
 * @route   GET /api/courses
 * @access  Public
 */
export const getCourses = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            category,
            level,
            search,
            instructor,
            featured,
            published = 'true',
            sortBy = 'createdAt',
            sortOrder = 'desc',
            minPrice,
            maxPrice
        } = req.query;

        const query = {};

        // Only show published courses for non-admin users
        if (published === 'true' || !req.user || req.user.role === 'cliente') {
            query.published = true;
        }

        // Category filter
        if (category) {
            query.categories = { $in: category.split(',') };
        }

        // Level filter
        if (level) {
            query.level = level;
        }

        // Instructor filter
        if (instructor) {
            query.instructor = instructor;
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // Price range filter (MZN)
        if (minPrice || maxPrice) {
            query.priceMZN = {};
            if (minPrice) query.priceMZN.$gte = parseFloat(minPrice);
            if (maxPrice) query.priceMZN.$lte = parseFloat(maxPrice);
        }

        // Search by title or description
        if (search) {
            query.$or = [
                { 'title.pt': { $regex: search, $options: 'i' } },
                { 'title.en': { $regex: search, $options: 'i' } },
                { 'description.pt': { $regex: search, $options: 'i' } },
                { 'description.en': { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Sorting
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [courses, total] = await Promise.all([
            Course.find(query)
                .populate('instructor', 'name avatar profession')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Course.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: {
                courses,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cursos.',
            code: 'GET_COURSES_ERROR'
        });
    }
};

/**
 * @desc    Get single course by slug or ID
 * @route   GET /api/courses/:identifier
 * @access  Public
 */
export const getCourse = async (req, res) => {
    try {
        const { identifier } = req.params;

        // Try to find by ID first, then by slug
        let course;
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            course = await Course.findById(identifier)
                .populate('instructor', 'name avatar bio profession socialLinks');
        }

        if (!course) {
            course = await Course.findOne({ slug: identifier })
                .populate('instructor', 'name avatar bio profession socialLinks');
        }

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado.',
                code: 'COURSE_NOT_FOUND'
            });
        }

        // Check if course is published (for non-admin users)
        if (!course.published && (!req.user || req.user.role === 'cliente')) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado.',
                code: 'COURSE_NOT_FOUND'
            });
        }

        // Get modules with lessons
        const modules = await Module.find({ courseId: course._id })
            .sort({ order: 1 })
            .lean();

        // Get lessons for each module
        for (let module of modules) {
            const lessons = await Lesson.find({ moduleId: module._id })
                .sort({ order: 1 })
                .select('-materials.fileUrl') // Hide material URLs for non-enrolled users
                .lean();
            module.lessons = lessons;
        }

        // Check if user is enrolled
        let enrollment = null;
        if (req.user) {
            enrollment = await Enrollment.findOne({
                userId: req.user._id,
                courseId: course._id
            }).select('status progress overallProgress approvedAt');
        }

        res.json({
            success: true,
            data: {
                course,
                modules,
                enrollment,
                isEnrolled: enrollment?.status === 'APROVADO'
            }
        });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar curso.',
            code: 'GET_COURSE_ERROR'
        });
    }
};

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private/Admin
 */
export const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            shortDescription,
            priceMZN,
            priceUSD,
            discountMZN,
            discountUSD,
            categories,
            level,
            language,
            requirements,
            objectives,
            targetAudience,
            certificate,
            tags,
            paymentInfo,
            image
        } = req.body;

        const course = await Course.create({
            title,
            description,
            shortDescription,
            instructor: req.user._id,
            priceMZN,
            priceUSD,
            discountMZN,
            discountUSD,
            categories,
            level,
            language,
            requirements,
            objectives,
            targetAudience,
            certificate,
            tags,
            paymentInfo,
            image
        });

        // Log action
        await Log.createLog({
            userId: req.user._id,
            action: 'course_create',
            description: `Course created: ${course.title.pt}`,
            targetType: 'course',
            targetId: course._id,
            newData: { title, priceMZN, categories },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            message: 'Curso criado com sucesso!',
            data: {
                course
            }
        });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar curso.',
            code: 'CREATE_COURSE_ERROR'
        });
    }
};

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private/Admin
 */
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado.',
                code: 'COURSE_NOT_FOUND'
            });
        }

        const allowedFields = [
            'title', 'description', 'shortDescription', 'priceMZN', 'priceUSD',
            'discountMZN', 'discountUSD', 'categories', 'level', 'language',
            'requirements', 'objectives', 'targetAudience', 'certificate',
            'tags', 'paymentInfo', 'image', 'featured'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                course[field] = req.body[field];
            }
        });

        await course.save();

        // Log action
        await Log.createLog({
            userId: req.user._id,
            action: 'course_update',
            description: `Course updated: ${course.title.pt}`,
            targetType: 'course',
            targetId: course._id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: 'Curso atualizado com sucesso!',
            data: {
                course
            }
        });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar curso.',
            code: 'UPDATE_COURSE_ERROR'
        });
    }
};

/**
 * @desc    Publish/Unpublish course
 * @route   PATCH /api/courses/:id/publish
 * @access  Private/Admin
 */
export const togglePublish = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado.',
                code: 'COURSE_NOT_FOUND'
            });
        }

        // Check if course has content before publishing
        if (!course.published) {
            const moduleCount = await Module.countDocuments({ courseId: course._id });
            if (moduleCount === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Adicione pelo menos um módulo antes de publicar o curso.',
                    code: 'NO_MODULES'
                });
            }
        }

        course.published = !course.published;
        await course.save();

        // Log action
        await Log.createLog({
            userId: req.user._id,
            action: course.published ? 'course_publish' : 'course_unpublish',
            description: `Course ${course.published ? 'published' : 'unpublished'}: ${course.title.pt}`,
            targetType: 'course',
            targetId: course._id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: course.published ? 'Curso publicado!' : 'Curso despublicado!',
            data: {
                course
            }
        });
    } catch (error) {
        console.error('Toggle publish error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao alterar status do curso.',
            code: 'TOGGLE_PUBLISH_ERROR'
        });
    }
};

/**
 * @desc    Delete course (Superadmin only)
 * @route   DELETE /api/courses/:id
 * @access  Private/Superadmin
 */
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado.',
                code: 'COURSE_NOT_FOUND'
            });
        }

        // Check for active enrollments
        const activeEnrollments = await Enrollment.countDocuments({
            courseId: course._id,
            status: 'APROVADO'
        });

        if (activeEnrollments > 0) {
            return res.status(400).json({
                success: false,
                message: `Não é possível deletar um curso com ${activeEnrollments} inscrições ativas.`,
                code: 'HAS_ACTIVE_ENROLLMENTS'
            });
        }

        // Delete all related data
        const modules = await Module.find({ courseId: course._id });
        for (const module of modules) {
            await Lesson.deleteMany({ moduleId: module._id });
        }
        await Module.deleteMany({ courseId: course._id });
        await Enrollment.deleteMany({ courseId: course._id });

        await course.deleteOne();

        // Log action
        await Log.createLog({
            userId: req.user._id,
            action: 'course_delete',
            description: `Course deleted: ${course.title.pt}`,
            targetType: 'course',
            targetId: course._id,
            previousData: { title: course.title, instructor: course.instructor },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: 'Curso deletado com sucesso!'
        });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar curso.',
            code: 'DELETE_COURSE_ERROR'
        });
    }
};

/**
 * @desc    Get course categories
 * @route   GET /api/courses/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
    const categories = [
        { id: 'engenharia-civil', name: { pt: 'Engenharia Civil', en: 'Civil Engineering' } },
        { id: 'engenharia-mecanica', name: { pt: 'Engenharia Mecânica', en: 'Mechanical Engineering' } },
        { id: 'engenharia-eletrica', name: { pt: 'Engenharia Elétrica', en: 'Electrical Engineering' } },
        { id: 'engenharia-informatica', name: { pt: 'Engenharia Informática', en: 'Computer Engineering' } },
        { id: 'arquitetura', name: { pt: 'Arquitetura', en: 'Architecture' } },
        { id: 'gestao-projetos', name: { pt: 'Gestão de Projetos', en: 'Project Management' } },
        { id: 'seguranca-trabalho', name: { pt: 'Segurança do Trabalho', en: 'Work Safety' } },
        { id: 'autocad', name: { pt: 'AutoCAD', en: 'AutoCAD' } },
        { id: 'bim-revit', name: { pt: 'BIM/Revit', en: 'BIM/Revit' } },
        { id: 'excel-avancado', name: { pt: 'Excel Avançado', en: 'Advanced Excel' } },
        { id: 'programacao', name: { pt: 'Programação', en: 'Programming' } },
        { id: 'redes', name: { pt: 'Redes', en: 'Networking' } },
        { id: 'energia-renovavel', name: { pt: 'Energia Renovável', en: 'Renewable Energy' } },
        { id: 'consultoria', name: { pt: 'Consultoria', en: 'Consulting' } },
        { id: 'outros', name: { pt: 'Outros', en: 'Others' } }
    ];

    res.json({
        success: true,
        data: { categories }
    });
};

/**
 * @desc    Get featured courses
 * @route   GET /api/courses/featured
 * @access  Public
 */
export const getFeaturedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ published: true, featured: true })
            .populate('instructor', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(6);

        res.json({
            success: true,
            data: { courses }
        });
    } catch (error) {
        console.error('Get featured courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar cursos em destaque.',
            code: 'GET_FEATURED_ERROR'
        });
    }
};
