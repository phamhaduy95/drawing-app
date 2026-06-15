<script setup lang="ts">
	import { computed } from 'vue';
	import { TextArea } from '@packages/vue-components';
	import { useVueFlow } from '@vue-flow/core';
	import { BaseNode, type BaseNodeProps } from '@/modules/designer/components/Nodes/BaseNode';
	import type { FormFieldNodeData } from '@/modules/designer/types/Node.type';

	export type TextAreaNodeProps = BaseNodeProps;

	const props = defineProps<TextAreaNodeProps>();

	const nodeConfig = computed(() => props.data as FormFieldNodeData);
	const { updateNodeData } = useVueFlow();

	const onInput = (value: string) => {
		updateNodeData(props.id, { value });
	};

	const onKeyDown = (e: KeyboardEvent) => {
		e.stopPropagation();
	};
</script>

<template>
	<BaseNode v-bind="props">
		<template #default>
			<TextArea
				class="w-full h-full pointer-events-auto"
				:placeholder="nodeConfig.placeholder"
				@update:model-value="onInput"
				@keydown="onKeyDown"
			/>
		</template>
	</BaseNode>
</template>
