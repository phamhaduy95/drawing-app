import { computed, unref, type MaybeRef } from 'vue';
import { useTagBindingStore } from './useTagRegister';

export const useNodeTagBinding = (nodeIdRef: MaybeRef<string | undefined>) => {
	const store = useTagBindingStore();

	const linkedTagIds = computed(() => {
		const nodeId = unref(nodeIdRef);
		if (!nodeId) return [];

		const tagIds = new Set<string>();
		for (const [tagId, bindings] of store.tagBindings.entries()) {
			if (bindings.some((b) => b.nodeId === nodeId)) {
				tagIds.add(tagId);
			}
		}
		return Array.from(tagIds);
	});

	const hasLinkedTags = computed(() => linkedTagIds.value.length > 0);

	return {
		linkedTagIds,
		hasLinkedTags
	};
};
