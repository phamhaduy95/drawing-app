<script setup lang="ts">
	import { useVueFlow } from '@vue-flow/core';
	import { NodeResizer } from '@vue-flow/node-resizer';
	import { useKeyModifier } from '@vueuse/core';
	import { computed, ref } from 'vue';

	import { Chip } from '@packages/vue-components';

	import { useResize } from '@/modules/designer/composables/useResize';
	import { useRotation } from '@/modules/designer/composables/useRotation';
	import { useTagsStore } from '@/modules/designer/composables/useTagsStore';

	import BaseNodeConnector from './BaseNodeConnector.vue';
	import BaseNodeTextInput from './BaseNodeTextInput.vue';

	import type { BaseNodeProps, BaseNodeSlots } from './BaseNode.type';

	import {
		defaultNodeDimensions,
		resizerHandleStyle,
		resizerLineStyle
	} from '@/modules/designer/constant/default';

	import IconRotate from '@assets/toolbar-icons/rotate.svg';

	const props = withDefaults(defineProps<BaseNodeProps>(), {
		defaultNodeWidth: defaultNodeDimensions.width,
		defaultNodeHeight: defaultNodeDimensions.height,
		keepDefaultRatio: false
	});

	defineSlots<BaseNodeSlots>();

	const isShift = useKeyModifier('Shift');

	const computedKeepAspectRatio = computed(() => {
		const isShiftPressed = Boolean(isShift.value);
		if (props.keepDefaultRatio) {
			return props.keepAspectRatio;
		}
		return isShiftPressed;
	});

	const { nodeRef, onRotateMouseDown: onRotateMouseDown, canRotate } = useRotation(props.id);
	const { onResizeStart, onResize, onResizeEnd } = useResize(props.id);

	const shapeWidth = computed(() => props.dimensions.width || props.defaultNodeWidth);
	const shapeHeight = computed(() => props.dimensions.height || props.defaultNodeHeight);

	const tagsStore = useTagsStore();
	const boundTags = computed(() => {
		const tagIds = props.data.tagIds || [];
		return tagsStore.tags.filter((t) => tagIds.includes(t.id));
	});

	const { updateNodeData } = useVueFlow();

	const unbindTag = (tagId: string) => {
		const newTagIds = props.data.tagIds?.filter((id) => id !== tagId) || [];
		updateNodeData(props.id, { tagIds: newTagIds });
	};

	const nodeTextInputRef = ref<InstanceType<typeof BaseNodeTextInput> | null>(null);

	const onDoubleClick = () => {
		nodeTextInputRef.value?.onDoubleClick();
	};
</script>

<template>
	<div
		ref="nodeRef"
		class="generic-shape-container relative overflow-visible rounded-none border border-dashed border-transparent bg-transparent"
		:style="{
			transform: `rotate(${props.data.rotation || 0}deg)`,
			width: dynamicSize ? 'max-content' : `${shapeWidth}px`,
			height: dynamicSize ? 'max-content' : `${shapeHeight}px`,
			top: '0px',
			left: '0px'
		}"
		@dblclick="onDoubleClick"
	>
		<slot
			name="rotateHandler"
			:selected="selected"
		>
			<div
				v-if="canRotate && selected"
				class="absolute left-1/2 top-0 flex h-6 w-6 -translate-x-1/2 -translate-y-full cursor-pointer items-center justify-center"
				@mousedown="onRotateMouseDown"
			>
				<IconRotate class="h-3 w-3 text-gray-500" />
			</div>
		</slot>
		<slot
			name="resizer"
			:selected="selected"
			:resize-start="onResizeStart"
			:resize="onResize"
			:resize-end="onResizeEnd"
			:line-style="resizerLineStyle"
			:handle-style="resizerHandleStyle"
			:min-width="24"
			:min-height="24"
			:keep-aspect-ratio="computedKeepAspectRatio"
		>
			<NodeResizer
				:is-visible="selected"
				:line-style="resizerLineStyle"
				:handle-style="resizerHandleStyle"
				:min-width="24"
				:min-height="24"
				:keep-aspect-ratio="computedKeepAspectRatio"
				@resize-start="onResizeStart"
				@resize="onResize"
				@resize-end="onResizeEnd"
			/>
		</slot>
		<slot
			v-if="!hideConnector"
			name="connector"
			:is-visible="selected"
			:shape-width="shapeWidth"
			:shape-height="shapeHeight"
			:is-node-selected="selected"
		>
			<BaseNodeConnector
				:is-visible="selected"
				:shape-width="shapeWidth"
				:shape-height="shapeHeight"
				:connectors="connectors"
				:is-node-selected="selected"
			/>
		</slot>
		<slot
			name="default"
			:shape-width="shapeWidth"
			:shape-height="shapeHeight"
		>
		</slot>

		<!-- Label Display -->
		<BaseNodeTextInput
			:id="props.id"
			ref="nodeTextInputRef"
			:data="props.data"
			:selected="selected"
		/>

		<!-- Tag Display -->
		<div
			v-if="boundTags.length > 0 && props.data.showTag"
			class="absolute -right-1 translate-x-full top-0 translate-y-2 pointer-events-none z-10 flex flex-col gap-1"
		>
			<Chip
				v-for="boundTag in boundTags"
				:key="boundTag.id"
				:label="boundTag.label.value"
				removable
				color="primary"
				size="sm"
				class="pointer-events-auto w-min"
				@remove="unbindTag(boundTag.id)"
			/>
		</div>
	</div>
</template>
