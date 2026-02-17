import { toast } from 'sonner';

/**
 * Global Notification Service
 * Defines standard toast messages for the application.
 */
const notify = {
    /**
     * Show success toast (Green)
     * @param {string} message - Message to display
     */
    success: (message) => toast.success(message),

    /**
     * Show error toast (Red)
     * @param {string} message - Message to display
     */
    error: (message) => toast.error(message),

    /**
     * Show warning toast (Amber/Yellow)
     * @param {string} message - Message to display
     */
    warning: (message) => toast.warning(message),

    /**
     * Show info toast (Blue/Neutral)
     * @param {string} message - Message to display
     */
    info: (message) => toast.info(message),

    /**
     * Generate dynamic CRUD message
     * @param {'create' | 'update' | 'delete' | 'archive' | 'restore'} operationType 
     * @param {string} entityName - Name of the entity (e.g., 'الخدمة', 'المستخدم')
     */
    crud: (operationType, entityName) => {
        switch (operationType) {
            case 'create':
                toast.success(`تم إنشاء ${entityName} بنجاح`);
                break;
            case 'update':
                toast.success(`تم تحديث ${entityName} بنجاح`);
                break;
            case 'delete':
                toast.success(`تم حذف ${entityName} بنجاح`);
                break;
            case 'archive':
                toast.success(`تم أرشفة ${entityName} بنجاح`);
                break;
            case 'restore':
                toast.success(`تم استعادة ${entityName} بنجاح`);
                break;
            default:
                toast.success(`تمت العملية بنجاح`);
        }
    }
};

export default notify;
