import { useTagBindingStore } from './useTagBindingStore';

export const useTagRegister = () => {
	const store = useTagBindingStore();

	const registerTag = (tagId: string, node: { nodeId: string; field: string }) => {
		store.addTagBinding(tagId, node.nodeId, node.field);
	};

	const unregisterTag = (tagId: string, node: { nodeId: string; field: string }) => {
		store.removeTagBinding(tagId, node.nodeId, node.field);
	};

	return {
		registerTag,
		unregisterTag
	};
};
