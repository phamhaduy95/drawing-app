<script setup lang="ts">
	import { computed } from 'vue';
	import { Checkbox } from '@packages/vue-components';
	import { useVueFlow } from '@vue-flow/core';
	import { BaseNode, type BaseNodeProps } from '@/modules/designer/components/Nodes/BaseNode';
	import type { FormFieldNodeData } from '@/modules/designer/types/Node.type';

	export type CheckboxNodeProps = BaseNodeProps;

	const props = defineProps<CheckboxNodeProps>();

	const nodeConfig = computed(() => props.data as FormFieldNodeData);
	const { updateNodeData } = useVueFlow();

	const onInput = (checked: boolean) => {
		updateNodeData(props.id, { value: checked ? 'true' : 'false' });
	};

	const onKeyDown = (e: KeyboardEvent) => {
		e.stopPropagation();
	};

	const isChecked = computed(() => nodeConfig.value.value === 'true');
</script>

<template>
	<BaseNode v-bind="props">
		<template #default>
			<Checkbox
				class="w-full h-full pointer-events-auto flex items-center justify-center"
				:checked="isChecked"
				@update:checked="onInput"
				@keydown="onKeyDown"
			/>
		</template>
	</BaseNode>
</template>
