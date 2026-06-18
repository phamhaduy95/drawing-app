import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface TagBindingNode {
	nodeId: string;
	field: string;
}

export const useTagBindingStore = defineStore('tagBindings', () => {
	const tagBindings = ref<Map<string, TagBindingNode[]>>(new Map());

	const addTagBinding = (tagId: string, nodeId: string, field: string) => {
		const bindings = tagBindings.value.get(tagId) || [];
		
		const exists = bindings.some(b => b.nodeId === nodeId && b.field === field);
		if (!exists) {
			bindings.push({ nodeId, field });
			tagBindings.value.set(tagId, bindings);
		}
	};

	const removeTagBinding = (tagId: string, nodeId: string, field: string) => {
		const bindings = tagBindings.value.get(tagId);
		if (bindings) {
			const newBindings = bindings.filter(b => !(b.nodeId === nodeId && b.field === field));
			if (newBindings.length === 0) {
				tagBindings.value.delete(tagId);
			} else {
				tagBindings.value.set(tagId, newBindings);
			}
		}
	};

	const removeTag = (tagId: string) => {
		tagBindings.value.delete(tagId);
	};

	const clear = () => {
		tagBindings.value.clear();
	};

	return {
		tagBindings,
		addTagBinding,
		removeTagBinding,
		removeTag,
		clear
	};
});
