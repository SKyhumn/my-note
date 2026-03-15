export interface InputModalProps {
    message: string;
    categoryName: string;
    setCategoryName: (value: string) => void;
    loading: boolean;
    addCategoryAndClose: () => void;
    onClose: () => void;
}