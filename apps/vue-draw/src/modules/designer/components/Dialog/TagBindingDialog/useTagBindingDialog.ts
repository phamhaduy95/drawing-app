import { useTagRegister } from '@/modules/designer/composables/useTagRegister';

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ConditionalRule, TagBindingMode } from './TagBindingDialog.type';
import { useVueFlow } from '@vue-flow/core';

const useTagBindingDialogStore = defineStore('tagBindingDialog', () => {
	const isOpen = ref(false);
	const selectedMode = ref<TagBindingMode>('direct');
	const initialTag = ref<string>();
	const expressionValue = ref<string>();
	const selectedTag = ref<string>();
	const selectedNode = ref<{ nodeId: string; field: string } | null>(null);
	const rules = ref<ConditionalRule[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateFunction = ref<((value: any) => void) | undefined>();

	return {
		isOpen,
		selectedMode,
		expressionValue,
		selectedTag,
		selectedNode,
		rules,
		initialTag,
		updateFunction
	};
});

export const useTagBindingDialog = () => {
	const store = useTagBindingDialogStore();
	const { registerTag, unregisterTag } = useTagRegister();
	const { updateNodeData, findNode } = useVueFlow();

	const openDialog = (
		node: { nodeId: string; field: string },
		tag?: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		updateFunction?: (value: any) => void,
		mode: TagBindingMode = 'direct'
	) => {
		store.selectedNode = node;
		store.initialTag = tag;
		store.updateFunction = updateFunction;
		store.selectedMode = mode;
		store.isOpen = true;
	};

	const updateNodeBinding = () => {
		if (!store.selectedNode || !store.selectedTag) return;

		const node = findNode(store.selectedNode.nodeId);
		if (!node) return;

		updateNodeData(store.selectedNode.nodeId, {
			...node.data,
			bindings: {
				...(node.data?.bindings || {}),
				[store.selectedNode.field]: store.selectedTag
			}
		});
	};

	const closeDialog = () => {
		store.isOpen = false;
		store.selectedNode = null;
		store.selectedTag = undefined;
		store.initialTag = undefined;
		store.expressionValue = undefined;
		store.rules = [];
		store.updateFunction = undefined;
		store.selectedMode = 'direct';
	};

	const clearBinding = (nodeId: string, field: string) => {
		const node = findNode(nodeId);
		if (!node) return;

		const currentTag = node.data?.bindings?.[field];
		if (currentTag) {
			unregisterTag({ tagId: currentTag, nodeId, field });
		}

		const newBindings = { ...(node.data?.bindings || {}) };
		delete newBindings[field];

		updateNodeData(nodeId, {
			...node.data,
			bindings: newBindings
		});
	};

	const saveBinding = () => {
		switch (store.selectedMode) {
			case 'direct':
				if (store.selectedNode) {
					if (store.initialTag) {
						unregisterTag({ tagId: store.initialTag, ...store.selectedNode });
					}
					if (store.selectedTag && store.updateFunction) {
						registerTag({
							tagId: store.selectedTag,
							...store.selectedNode,
							updateFunction: store.updateFunction
						});
					}

					updateNodeBinding();
				}
				closeDialog();
				break;
			case 'expression':
				closeDialog();
				break;
			case 'conditional':
				closeDialog();
				break;
		}
	};

	return {
		store,
		openDialog,
		closeDialog,
		saveBinding,
		clearBinding
	};
};
