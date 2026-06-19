/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useTagsStore } from './useTagsStore';
import { useSimulation } from './useSimulation';
import type { MeasurementType } from '@/modules/designer/types/Tag.type';

export type ExpressionUpdater = (tags: MeasurementType[]) => void;

export type BindingDataRecord = {
	tagId: string;
	nodeId: string;
	field: string;
	updateFunction: (value: any) => void;
};

export const useTagBindingStore = defineStore('tagBindings', () => {
	const tagBindings = ref<Map<string, BindingDataRecord[]>>(new Map());
	const expressionUpdaters = ref<Map<string, ExpressionUpdater>>(new Map());

	const tagsStore = useTagsStore();
	const simulationStore = useSimulation();

	watch(
		() => tagsStore.tags,
		(newTags) => {
			if (simulationStore.status !== 'RUN') return;

			newTags.forEach((tag) => {
				const base = `Root.${tag.server.name}.${tag.functionBlock.name}`;
				const tagFields = ['label', 'description', 'value', 'unit'] as const;

				tagFields.forEach((field) => {
					const bindings = tagBindings.value.get(`${base}.${field}`);
					if (!bindings?.length) return;

					const { value: rawVal, dataType } = tag[field];
					let parsedVal: any = rawVal;

					if (dataType === 'number') {
						parsedVal = Number(rawVal);
					} else if (dataType === 'boolean') {
						parsedVal = rawVal === 'true';
					}

					bindings.forEach((binding) => binding.updateFunction(parsedVal));
				});
			});

			// Execute all registered expression updaters
			expressionUpdaters.value.forEach((updater) => {
				updater(newTags);
			});
		},
		{ deep: true }
	);

	const addTagBinding = (data: BindingDataRecord) => {
		const bindings = tagBindings.value.get(data.tagId) || [];

		const exists = bindings.some((b) => b.nodeId === data.nodeId && b.field === data.field);
		if (!exists) {
			bindings.push(data);
			tagBindings.value.set(data.tagId, bindings);
		}
	};

	const removeTagBinding = (data: Pick<BindingDataRecord, 'tagId' | 'nodeId' | 'field'>) => {
		const bindings = tagBindings.value.get(data.tagId);
		if (bindings) {
			const newBindings = bindings.filter(
				(b) => !(b.nodeId === data.nodeId && b.field === data.field)
			);
			if (newBindings.length === 0) {
				tagBindings.value.delete(data.tagId);
			} else {
				tagBindings.value.set(data.tagId, newBindings);
			}
		}
	};

	const removeTag = (tagId: string) => {
		tagBindings.value.delete(tagId);
	};

	const removeBindingsForNodeField = (nodeId: string, field: string) => {
		for (const [tagId, bindings] of tagBindings.value.entries()) {
			const newBindings = bindings.filter((b) => !(b.nodeId === nodeId && b.field === field));
			if (newBindings.length === 0) {
				tagBindings.value.delete(tagId);
			} else if (newBindings.length !== bindings.length) {
				tagBindings.value.set(tagId, newBindings);
			}
		}
		expressionUpdaters.value.delete(`${nodeId}-${field}`);
	};

	const clear = () => {
		tagBindings.value.clear();
		expressionUpdaters.value.clear();
	};

	const registerExpressionUpdater = (nodeId: string, field: string, updater: ExpressionUpdater) => {
		expressionUpdaters.value.set(`${nodeId}-${field}`, updater);
	};

	const unregisterExpressionUpdater = (nodeId: string, field: string) => {
		expressionUpdaters.value.delete(`${nodeId}-${field}`);
	};

	return {
		tagBindings,
		expressionUpdaters,
		addTagBinding,
		removeTagBinding,
		removeBindingsForNodeField,
		removeTag,
		clear,
		registerExpressionUpdater,
		unregisterExpressionUpdater
	};
});

export const useTagRegister = () => {
	const store = useTagBindingStore();

	const registerTag = (data: BindingDataRecord) => {
		store.addTagBinding(data);
	};

	const unregisterTag = (data: Pick<BindingDataRecord, 'tagId' | 'nodeId' | 'field'>) => {
		store.removeTagBinding(data);
	};

	const clearBindingsForNodeField = (nodeId: string, field: string) => {
		store.removeBindingsForNodeField(nodeId, field);
	};

	const registerExpressionUpdater = (
		nodeId: string,
		field: string,
		updater: ExpressionUpdater
	) => {
		store.registerExpressionUpdater(nodeId, field, updater);
	};

	const unregisterExpressionUpdater = (nodeId: string, field: string) => {
		store.unregisterExpressionUpdater(nodeId, field);
	};

	return {
		registerTag,
		unregisterTag,
		clearBindingsForNodeField,
		registerExpressionUpdater,
		unregisterExpressionUpdater
	};
};
