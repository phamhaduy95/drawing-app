<script setup lang="ts">
	import {
		Button,
		Dialog,
		RadioGroup,
		SingleCombobox,
		SuggestionInput
	} from '@packages/vue-components';
	import { ref } from 'vue';
	import { useTagBindingDialog } from './useTagBindingDialog';
	import { tagOptions } from '@/modules/designer/constant/defaultTags';

	const { isOpen, closeDialog, confirmDialog } = useTagBindingDialog();

	const options = [
		{ label: 'Bind', value: 'bind' },
		{ label: 'Single Expression', value: 'expression' },
		{ label: 'Conditional expression', value: 'conditional-expression' }
	];

	const selectedMode = ref('bind');
	const tagValue = ref('');
	const expressionValue = ref('');
	const conditionalExpressionValue = ref('');

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			closeDialog();
		}
	};

	const handleCancel = () => {
		closeDialog();
	};

	const handleConfirm = () => {
		confirmDialog({
			tag: tagValue.value
		});
	};
</script>

<template>
	<Dialog
		title="Tag Bindings"
		:open="isOpen"
		@update:open="handleOpenChange"
	>
		<div class="flex flex-col gap-6 py-2">
			<RadioGroup
				v-model="selectedMode"
				label="Mode"
				:options="options"
			/>

			<div
				v-if="selectedMode === 'bind'"
				class="animate-in fade-in slide-in-from-top-2 duration-200"
			>
				<SingleCombobox
					v-model="tagValue"
					label="Tag"
					:items="tagOptions"
					placeholder="Select a tag"
				/>
			</div>

			<div
				v-else-if="selectedMode === 'expression'"
				class="animate-in fade-in slide-in-from-top-2 duration-200"
			>
				<SuggestionInput
					v-model="expressionValue"
					label="Expression"
					:suggestions="tagOptions"
					placeholder="Enter expression (e.g. tag1 + tag2)"
				/>
			</div>

			<div
				v-else-if="selectedMode === 'conditional-expression'"
				class="animate-in fade-in slide-in-from-top-2 duration-200"
			>
				<SuggestionInput
					v-model="conditionalExpressionValue"
					label="Tag name"
					:suggestions="tagOptions"
					placeholder="Enter conditional expression"
				/>
			</div>
		</div>

		<template #footer>
			<div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
				<Button
					variant="outlined"
					color="secondary"
					@click="handleCancel"
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="primary"
					@click="handleConfirm"
				>
					Save
				</Button>
			</div>
		</template>
	</Dialog>
</template>
