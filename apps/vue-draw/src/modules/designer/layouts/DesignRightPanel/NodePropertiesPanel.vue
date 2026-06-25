<script setup lang="ts">
	import { computed, ref, type ComponentInstance } from 'vue';
	import type { Dimensions, XYPosition } from '@vue-flow/core';

	import { SingleSlider, NumberInput, ColorPicker, Switch } from '@packages/vue-components';
	import { useNodeConfig } from '@/modules/designer/composables/useNodeConfig';
	import { defaultBasicShapeNodeData } from '@/modules/designer/constant/default';
	import { activeDragTagType } from '@/modules/designer/composables/useDnD';
	import {
		type BasicShapeNodeData,
		type FormFieldNodeData,
		NodeType
	} from '@/modules/designer/types/Node.type';
	import { PropertyField } from '../PropertyField';
	import { useTagBindingDialog } from '@/modules/designer/components/Dialog/TagBindingDialog/useTagBindingDialog';
	import { useSimulation } from '@/modules/designer/composables/useSimulation';
	import { useTagsStore } from '@/modules/designer/composables/useTagsStore';
	import { storeToRefs } from 'pinia';

	type NumberInputProps = ComponentInstance<typeof NumberInput>['$props'];
	type SingleSliderProps = ComponentInstance<typeof SingleSlider>['$props'];

	const { selectedNode, updateNodeBasicProps, updateNodeData } = useNodeConfig();

	const { openDialog, clearBinding, directBindTag } = useTagBindingDialog();

	const simulationStore = useSimulation();
	const tagsStore = useTagsStore();
	const { mode } = storeToRefs(simulationStore);
	const isLocking = computed(() => mode.value === 'simulation');

	const getDisplayTagLabel = (tagId?: string) => {
		if (!tagId) return 'Tag';
		if (simulationStore.status !== 'RUN') return tagId;

		const parts = tagId.split('.');
		if (parts.length >= 4) {
			const server = parts[1];
			const block = parts[2];
			const field = parts[3] as 'label' | 'description' | 'value' | 'unit';

			const tag = tagsStore.tags.find(
				(t) => t.server.name === server && t.functionBlock.name === block
			);
			if (tag) {
				return String(tag[field]?.value ?? tagId);
			}
		}

		return tagId;
	};

	const nodePosition = computed<XYPosition>(() => ({
		x: Math.round(selectedNode.value?.position?.x ?? 0),
		y: Math.round(selectedNode.value?.position?.y ?? 0)
	}));
	const nodeDimensions = computed<Dimensions>(() => ({
		width: Math.round(selectedNode.value?.dimensions?.width ?? 0),
		height: Math.round(selectedNode.value?.dimensions?.height ?? 0)
	}));

	const nodeConfigurableData = computed(
		() => selectedNode.value?.data || defaultBasicShapeNodeData
	);

	const handleXChange = (value: number | null) => {
		updateNodeBasicProps({
			position: { x: value ?? 0, y: nodePosition.value?.y ?? 0 }
		});
	};

	const handleYChange = (value: number | null) => {
		updateNodeBasicProps({
			position: { x: nodePosition.value?.x ?? 0, y: value ?? 0 }
		});
	};

	const handleWidthChange = (value: number | null) => {
		updateNodeBasicProps({
			dimensions: {
				width: value ?? 0,
				height: nodeDimensions.value?.height ?? 0
			}
		});
	};

	const handleHeightChange = (value: number | null) => {
		updateNodeBasicProps({
			dimensions: {
				width: nodeDimensions.value?.width ?? 0,
				height: value ?? 0
			}
		});
	};

	const handleFillChange = (value: string) => {
		updateNodeData<BasicShapeNodeData>({ fill: value });
	};

	const handleStrokeChange = (value: string) => {
		updateNodeData<BasicShapeNodeData>({ stroke: value });
	};

	const hanldeStrokeWidthChange: SingleSliderProps['onUpdate:modelValue'] = (value: number) => {
		updateNodeData<BasicShapeNodeData>({ strokeWidth: value });
	};

	const nodeHidden = computed(() => selectedNode.value?.hidden ?? false);
	const nodeZIndex = computed(() => selectedNode.value?.zIndex ?? 0);

	const handleHiddenChange = (value: boolean) => {
		updateNodeBasicProps({ hidden: value ?? false });
	};

	const handleZIndexChange: NumberInputProps['onValueChange'] = (value) => {
		updateNodeBasicProps({ zIndex: value ?? 0 });
	};

	const progressBarValue = computed(() => {
		const data = nodeConfigurableData.value as unknown as FormFieldNodeData;
		return Number(data.value) || 0;
	});

	const handleProgressBarValueChange = (value: number) => {
		updateNodeData<FormFieldNodeData>({ value: value.toString() });
	};

	const dragHoverField = ref<string | null>(null);

	const handleDragEnter = (field: string) => {
		if (isLocking.value) return;
		dragHoverField.value = field;
	};

	const handleDragLeave = (field: string) => {
		if (dragHoverField.value === field) {
			dragHoverField.value = null;
		}
	};

	const isFieldIncompatible = (expectedType: string) => {
		if (!activeDragTagType.value) return false;
		return activeDragTagType.value !== expectedType;
	};

	const handleTagDrop = (event: DragEvent, field: string, updateFunction: (value: any) => void) => {
		dragHoverField.value = null;
		if (isLocking.value || !selectedNode.value?.id) return;

		try {
			const data = event.dataTransfer?.getData('application/vueflow');
			if (!data) return;

			const payload = JSON.parse(data);
			if (payload.isTag && payload.tagId) {
				directBindTag(selectedNode.value.id, field, payload.tagId, updateFunction);
			}
		} catch (e) {
			console.error('Failed to handle tag drop', e);
		}
	};
</script>

<template>
	<div class="flex-1 space-y-4 overflow-y-auto px-4 py-2">
		<div class="space-y-2">
			<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-800">Layout</h3>
			<div class="grid grid-cols-1 gap-3">
				<PropertyField
					label="Position X"
					:disabled="isLocking"
					:mode="selectedNode?.data?.bindings?.['position.x'] ? 'tag' : 'input'"
					:tag-label="getDisplayTagLabel(selectedNode?.data?.bindings?.['position.x'])"
					:is-drag-hovering="dragHoverField === 'position.x'"
					:is-incompatible-drag="isFieldIncompatible('number')"
					@bind="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'position.x' },
							undefined,
							handleXChange
						)
					"
					@edit="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'position.x' },
							selectedNode?.data?.bindings?.['position.x'],
							handleXChange
						)
					"
					@clear="clearBinding(selectedNode?.id || '', 'position.x')"
					@dragover.prevent
					@dragenter.prevent="handleDragEnter('position.x')"
					@dragleave.prevent="handleDragLeave('position.x')"
					@drop.prevent="handleTagDrop($event, 'position.x', handleXChange)"
				>
					<template #input>
						<NumberInput
							class="w-full"
							size="xs"
							:min="0"
							:model-value="nodePosition?.x"
							:disabled="isLocking"
							@update:model-value="handleXChange"
						/>
					</template>
				</PropertyField>
				<PropertyField
					label="Position Y"
					:disabled="isLocking"
					:mode="selectedNode?.data?.bindings?.['position.y'] ? 'tag' : 'input'"
					:tag-label="getDisplayTagLabel(selectedNode?.data?.bindings?.['position.y'])"
					:is-drag-hovering="dragHoverField === 'position.y'"
					:is-incompatible-drag="isFieldIncompatible('number')"
					@bind="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'position.y' },
							undefined,
							handleYChange
						)
					"
					@edit="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'position.y' },
							selectedNode?.data?.bindings?.['position.y'],
							handleYChange
						)
					"
					@clear="clearBinding(selectedNode?.id || '', 'position.y')"
					@dragover.prevent
					@dragenter.prevent="handleDragEnter('position.y')"
					@dragleave.prevent="handleDragLeave('position.y')"
					@drop.prevent="handleTagDrop($event, 'position.y', handleYChange)"
				>
					<template #input>
						<NumberInput
							class="w-full"
							size="xs"
							:min="0"
							:model-value="nodePosition?.y"
							:disabled="isLocking"
							@value-change="handleYChange"
						/>
					</template>
				</PropertyField>
				<PropertyField
					label="Width"
					:disabled="isLocking"
					:mode="selectedNode?.data?.bindings?.['dimensions.width'] ? 'tag' : 'input'"
					:tag-label="getDisplayTagLabel(selectedNode?.data?.bindings?.['dimensions.width'])"
					:is-drag-hovering="dragHoverField === 'dimensions.width'"
					:is-incompatible-drag="isFieldIncompatible('number')"
					@bind="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'dimensions.width' },
							undefined,
							handleWidthChange
						)
					"
					@edit="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'dimensions.width' },
							selectedNode?.data?.bindings?.['dimensions.width'],
							handleWidthChange
						)
					"
					@clear="clearBinding(selectedNode?.id || '', 'dimensions.width')"
					@dragover.prevent
					@dragenter.prevent="handleDragEnter('dimensions.width')"
					@dragleave.prevent="handleDragLeave('dimensions.width')"
					@drop.prevent="handleTagDrop($event, 'dimensions.width', handleWidthChange)"
				>
					<template #input>
						<NumberInput
							class="w-full"
							size="xs"
							:min="0"
							:model-value="nodeDimensions?.width"
							:disabled="isLocking"
							@value-change="handleWidthChange"
						/>
					</template>
				</PropertyField>
				<PropertyField
					label="Height"
					:disabled="isLocking"
					:mode="selectedNode?.data?.bindings?.['dimensions.height'] ? 'tag' : 'input'"
					:tag-label="getDisplayTagLabel(selectedNode?.data?.bindings?.['dimensions.height'])"
					:is-drag-hovering="dragHoverField === 'dimensions.height'"
					:is-incompatible-drag="isFieldIncompatible('number')"
					@bind="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'dimensions.height' },
							undefined,
							handleHeightChange
						)
					"
					@edit="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'dimensions.height' },
							selectedNode?.data?.bindings?.['dimensions.height'],
							handleHeightChange
						)
					"
					@clear="clearBinding(selectedNode?.id || '', 'dimensions.height')"
					@dragover.prevent
					@dragenter.prevent="handleDragEnter('dimensions.height')"
					@dragleave.prevent="handleDragLeave('dimensions.height')"
					@drop.prevent="handleTagDrop($event, 'dimensions.height', handleHeightChange)"
				>
					<template #input>
						<NumberInput
							class="w-full"
							size="xs"
							:min="0"
							:model-value="nodeDimensions?.height"
							:disabled="isLocking"
							@value-change="handleHeightChange"
						/>
					</template>
				</PropertyField>
			</div>
		</div>

		<!-- Appearance -->
		<div class="space-y-2">
			<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-800">Appearance</h3>
			<Switch
				name="hidden"
				label="Hidden Component"
				:checked="nodeHidden"
				size="xs"
				:disabled="isLocking"
				@update:checked="handleHiddenChange"
			/>
			<NumberInput
				class="w-full"
				label="Z-Index"
				size="xs"
				:model-value="nodeZIndex"
				:disabled="isLocking"
				@value-change="handleZIndexChange"
			/>
			<ColorPicker
				label="Background"
				:model-value="nodeConfigurableData.fill"
				format="hex"
				size="xs"
				:disabled="isLocking"
				@update:model-value="handleFillChange"
			/>
			<ColorPicker
				label="Stroke Color"
				:model-value="nodeConfigurableData.stroke"
				format="hex"
				size="xs"
				:disabled="isLocking"
				@update:model-value="handleStrokeChange"
			/>
			<div class="space-y-4 pt-1">
				<SingleSlider
					label="Border Size"
					:model-value="nodeConfigurableData.strokeWidth"
					:min="0"
					:max="5"
					:step="0.1"
					editable
					:disabled="isLocking"
					@update:model-value="hanldeStrokeWidthChange"
				/>
			</div>
		</div>

		<!-- Progress Bar Settings -->
		<div
			v-if="selectedNode?.type === NodeType.ProgressBar"
			class="space-y-2"
		>
			<h3 class="text-sm font-semibold uppercase tracking-wide text-gray-800">Progress Bar</h3>
			<div class="grid grid-cols-1 gap-3">
				<PropertyField
					label="Progress Level"
					:disabled="isLocking"
					:mode="selectedNode?.data?.bindings?.['value'] ? 'tag' : 'input'"
					:tag-label="getDisplayTagLabel(selectedNode?.data?.bindings?.['value'])"
					:is-drag-hovering="dragHoverField === 'value'"
					:is-incompatible-drag="isFieldIncompatible('number')"
					@bind="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'value' },
							undefined,
							handleProgressBarValueChange
						)
					"
					@edit="
						openDialog(
							{ nodeId: selectedNode?.id || '', field: 'value' },
							selectedNode?.data?.bindings?.['value'],
							handleProgressBarValueChange
						)
					"
					@clear="clearBinding(selectedNode?.id || '', 'value')"
					@dragover.prevent
					@dragenter.prevent="handleDragEnter('value')"
					@dragleave.prevent="handleDragLeave('value')"
					@drop.prevent="handleTagDrop($event, 'value', handleProgressBarValueChange)"
				>
					<template #input>
						<SingleSlider
							:model-value="progressBarValue"
							:min="0"
							:max="100"
							:step="1"
							editable
							:disabled="isLocking"
							@update:model-value="handleProgressBarValueChange"
						/>
					</template>
				</PropertyField>
			</div>
		</div>
	</div>
</template>
