<script setup lang="ts">
	import { computed } from 'vue';
	import { TrashIcon } from '@heroicons/vue/20/solid';
	import { SuggestionInput, IconButton, Checkbox } from '@packages/vue-components';
	import type { ConditionalRule } from './TagBindingDialog.type';

	const props = defineProps<{
		rule: ConditionalRule;
		index: number;
		tagOptions: any[];
	}>();

	const emit = defineEmits<{
		(e: 'remove'): void;
		(e: 'update', rule: ConditionalRule): void;
	}>();

	const continueModel = computed({
		get: () => props.rule.continue,
		set: (val) => emit('update', { ...props.rule, continue: val })
	});

	const conditionModel = computed({
		get: () => props.rule.condition,
		set: (val) => emit('update', { ...props.rule, condition: val })
	});

	const expressionModel = computed({
		get: () => props.rule.expression,
		set: (val) => emit('update', { ...props.rule, expression: val })
	});
</script>

<template>
	<tr class="bg-white hover:bg-gray-50 border-b border-gray-100 transition-colors group">
		<td class="p-2 w-16 text-center text-gray-500 font-medium">
			{{ index + 1 }}
		</td>
		<td class="p-2 w-20 text-center">
			<Checkbox
				v-model="continueModel"
				aria-label="Continue"
			/>
		</td>
		<td class="p-2">
			<SuggestionInput
				v-model="conditionModel"
				:suggestions="tagOptions"
				placeholder="Enter condition..."
				as="textarea"
			/>
		</td>
		<td class="p-2">
			<SuggestionInput
				v-model="expressionModel"
				:suggestions="tagOptions"
				placeholder="Enter expression..."
				as="textarea"
			/>
		</td>
		<td class="p-2 w-12 text-center">
			<IconButton
				variant="text"
				color="error"
				aria-label="Remove rule"
				@click="emit('remove')"
			>
				<TrashIcon class="w-4 h-4" />
			</IconButton>
		</td>
	</tr>
</template>
