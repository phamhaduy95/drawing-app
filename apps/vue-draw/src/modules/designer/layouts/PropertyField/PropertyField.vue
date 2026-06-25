<script setup lang="ts">
	import { LinkIcon, PencilIcon, XMarkIcon } from '@heroicons/vue/20/solid';
	import { IconButton, TextInput } from '@packages/vue-components';

	interface PropertyFieldProps {
		mode?: 'tag' | 'input';
		label?: string;
		tagLabel?: string;
		disabled?: boolean;
		isDragHovering?: boolean;
		isIncompatibleDrag?: boolean;
	}

	withDefaults(defineProps<PropertyFieldProps>(), {
		mode: 'input',
		label: '',
		tagLabel: '',
		disabled: false,
		isDragHovering: false,
		isIncompatibleDrag: false
	});

	interface PropertyFieldEmits {
		(e: 'bind'): void;
		(e: 'edit'): void;
		(e: 'clear'): void;
	}
	const emit = defineEmits<PropertyFieldEmits>();
</script>

<template>
	<div
		class="flex items-center gap-2 mb-2 w-full transition-all rounded-sm"
		:class="[
			isDragHovering
				? 'outline outline-2 outline-indigo-400 outline-offset-2 bg-indigo-50 z-10 relative'
				: '',
			isIncompatibleDrag ? 'opacity-40 grayscale pointer-events-none' : ''
		]"
	>
		<label
			class="w-1/3 text-xs font-medium text-gray-500 truncate"
			:title="label"
		>
			{{ label }}
		</label>
		<div class="flex-1 flex items-center gap-1 min-w-0">
			<template v-if="mode === 'tag'">
				<div
					class="flex-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded border border-indigo-200 truncate"
					:title="tagLabel"
				>
					{{ tagLabel }}
				</div>
				<div class="flex items-center shrink-0">
					<IconButton
						size="xs"
						variant="text"
						color="secondary"
						aria-label="Edit Tag"
						:disabled="disabled"
						@click="emit('edit')"
					>
						<PencilIcon class="w-4 h-4" />
					</IconButton>
					<IconButton
						size="xs"
						variant="text"
						color="error"
						aria-label="Clear Tag"
						:disabled="disabled"
						@click="emit('clear')"
					>
						<XMarkIcon class="w-4 h-4" />
					</IconButton>
				</div>
			</template>
			<template v-else>
				<div class="flex-1 min-w-0">
					<slot name="input">
						<TextInput
							size="sm"
							class="w-full"
						/>
					</slot>
				</div>
				<IconButton
					size="xs"
					variant="text"
					color="primary"
					class="shrink-0"
					aria-label="Bind Tag"
					:disabled="disabled"
					@click="emit('bind')"
				>
					<LinkIcon class="w-4 h-4" />
				</IconButton>
			</template>
		</div>
	</div>
</template>
