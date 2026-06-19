<script setup lang="ts">
	import { computed, type ComponentInstance } from 'vue';
	import type { Dimensions, XYPosition } from '@vue-flow/core';

	import { SingleSlider, NumberInput, ColorPicker, Switch } from '@packages/vue-components';
	import { useNodeConfig } from '@/modules/designer/composables/useNodeConfig';
	import { defaultBasicShapeNodeData } from '@/modules/designer/constant/default';
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

	const { openDialog, clearBinding } = useTagBindingDialog();

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
