/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import * as math from 'mathjs';
import { useTagRegister } from '@/modules/designer/composables/useTagRegister';

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ConditionalRule, TagBindingMode } from './TagBindingDialog.type';
import type { MeasurementType } from '@/modules/designer/types/Tag.type';
import { useVueFlow } from '@vue-flow/core';
import { useTagsStore } from '@/modules/designer/composables/useTagsStore';

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
	const { registerTag, clearBindingsForNodeField, registerExpressionUpdater } = useTagRegister();
	const tagsStore = useTagsStore();
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

		clearBindingsForNodeField(nodeId, field);

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
					clearBindingsForNodeField(store.selectedNode.nodeId, store.selectedNode.field);

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
				if (store.selectedNode && store.expressionValue) {
					clearBindingsForNodeField(store.selectedNode.nodeId, store.selectedNode.field);

					// Since the mathjs.parse does not accept variable that has this format %A.B.C.D.
					// add the function to wrap around any str that belong this format with vars[""]
					const wrappedExpression = store.expressionValue.replace(
						/%([a-zA-Z0-9_.]+)/g,
						(_, path) => `vars["${path}"]`
					);

					const ast = math.parse(wrappedExpression);

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const tagPathnames = ast.filter((n: any) => n.isConstantNode).map((e: any) => e.value);

					try {
						const compiledExpression = math.compile(wrappedExpression);

						const innerUpdater = store.updateFunction;
						const updateNode = (_: MeasurementType[]) => {
							const vars: Record<string, any> = {};

							tagPathnames.forEach((pathname: string) => {
								if (typeof pathname !== 'string') return;

								const parts = pathname.split('.');
								if (parts.length >= 4) {
									const server = parts[1];
									const block = parts[2];
									const field = parts[3] as 'label' | 'description' | 'value' | 'unit';

									const tag = tagsStore.tags.find(
										(t) => t.server.name === server && t.functionBlock.name === block
									);

									if (tag) {
										const rawVal = tag[field].value;
										const dataType = tag[field].dataType;
										let parsedVal: any = rawVal;

										if (dataType === 'number') {
											const num = Number(rawVal);
											parsedVal = !isNaN(num) ? num : rawVal;
										} else if (dataType === 'boolean') {
											parsedVal = rawVal === 'true';
										}

										vars[pathname] = parsedVal;
									}
								}
							});

							console.log('var', vars);

							try {
								const result = compiledExpression.evaluate({ vars });
								innerUpdater!(result);
							} catch (e) {
								console.error('Expression evaluation error', e);
							}
						};

						registerExpressionUpdater(
							store.selectedNode!.nodeId,
							store.selectedNode!.field,
							updateNode
						);

						store.selectedTag = store.expressionValue;
						updateNodeBinding();
					} catch (e) {
						console.error('Failed to parse expression', e);
					}
				}
				closeDialog();
				break;
			case 'conditional':
				closeDialog();
				break;
		}
	};

	const directBindTag = (
		nodeId: string,
		field: string,
		tagId: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		updateFunction: (value: any) => void
	) => {
		const node = findNode(nodeId);
		if (!node) return;

		clearBindingsForNodeField(nodeId, field);
		registerTag({
			tagId,
			nodeId,
			field,
			updateFunction
		});

		updateNodeData(nodeId, {
			...node.data,
			bindings: {
				...(node.data?.bindings || {}),
				[field]: tagId
			}
		});
	};

	return {
		store,
		openDialog,
		closeDialog,
		saveBinding,
		clearBinding,
		directBindTag
	};
};
