<script setup lang="ts">
	import { ref, nextTick } from 'vue';
	import { useEventListener } from '@vueuse/core';
	import { useVueFlow } from '@vue-flow/core';
	import { type BaseNodeData } from '@/modules/designer/types/Node.type.ts';

	const props = defineProps<{
		id: string;
		data: BaseNodeData;
		selected: boolean;
	}>();

	const { updateNodeData } = useVueFlow();

	useEventListener('keydown', (e: KeyboardEvent) => {
		if (!props.selected || isEditing.value) return;

		const target = e.target as HTMLElement;
		if (
			target &&
			(target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
		) {
			return;
		}

		if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
			isEditing.value = true;

			updateNodeData(props.id, { label: '' });

			e.preventDefault();

			nextTick(() => {
				if (textareaRef.value) {
					textareaRef.value.focus();
				}
			});
		} else if (e.key === 'Enter') {
			isEditing.value = true;
			e.preventDefault();
			nextTick(() => {
				if (textareaRef.value) {
					textareaRef.value.focus();
				}
			});
		}
	});

	const isEditing = ref(false);
	const textareaRef = ref<HTMLTextAreaElement | null>(null);

	const onDoubleClick = async () => {
		if (isEditing.value) return;
		isEditing.value = true;
		await nextTick();
		if (textareaRef.value) {
			textareaRef.value.focus();
		}
	};

	defineExpose({
		onDoubleClick
	});

	const onBlur = () => {
		isEditing.value = false;
	};

	const onInput = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;
		updateNodeData(props.id, { label: target.value });
	};

	const onLabelKeyDown = (e: KeyboardEvent) => {
		e.stopPropagation();
		if (e.key === 'Escape') {
			textareaRef.value?.blur();
		}
	};
</script>

<template>
	<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
		<textarea
			v-if="isEditing"
			ref="textareaRef"
			class="w-full min-h-full bg-transparent border-none outline-none resize-none overflow-hidden text-center pointer-events-auto p-2"
			:value="props.data.label"
			@input="onInput"
			@blur="onBlur"
			@keydown="onLabelKeyDown"
		/>
		<div
			v-else-if="props.data.label"
			class="w-full h-full whitespace-pre-wrap wrap-break-word flex flex-col justify-center text-center p-2"
		>
			{{ props.data.label }}
		</div>
	</div>
</template>
