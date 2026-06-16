import { ref } from 'vue';
import type { TagBindingData } from './TagBindingDialog.type';

// Global state
const isOpen = ref(false);
const initialData = ref<TagBindingData | undefined>();
let resolvePromise: ((value: TagBindingData | null) => void) | null = null;

export const useTagBindingDialog = () => {
	const openDialog = (data?: TagBindingData): Promise<TagBindingData | null> => {
		initialData.value = data;
		isOpen.value = true;
		return new Promise((resolve) => {
			resolvePromise = resolve;
		});
	};

	const confirmDialog = (data: TagBindingData) => {
		isOpen.value = false;
		if (resolvePromise) {
			resolvePromise(data);
			resolvePromise = null;
		}
	};

	const closeDialog = () => {
		isOpen.value = false;
		if (resolvePromise) {
			resolvePromise(null);
			resolvePromise = null;
		}
	};

	return {
		isOpen,
		initialData,
		openDialog,
		confirmDialog,
		closeDialog
	};
};
