<script setup lang="ts">
	import {
		Button,
		Dialog,
		IconButton,
		RadioGroup,
		SingleCombobox,
		SuggestionInput
	} from '@packages/vue-components';
	import { ref, watch } from 'vue';
	import { Bars3Icon, TrashIcon } from '@heroicons/vue/20/solid';
	import { useTagBindingDialog } from './useTagBindingDialog';
	import { tagOptions } from '@/modules/designer/constant/defaultTags';
	import type { ConditionalRule } from './TagBindingDialog.type';

	const { isOpen, closeDialog, confirmDialog, initialData } = useTagBindingDialog();

	const options = [
		{ label: 'Bind', value: 'bind' },
		{ label: 'Single Expression', value: 'expression' },
		{ label: 'Conditional expression', value: 'conditional-expression' }
	];

	const selectedMode = ref('bind');
	const tagValue = ref('');
	const expressionValue = ref('');
	const rules = ref<ConditionalRule[]>([]);
	const dragIndex = ref<number | null>(null);

	watch(isOpen, (val) => {
		if (val && initialData.value) {
			tagValue.value = initialData.value.tag || '';
			expressionValue.value = initialData.value.expression || '';
			rules.value = initialData.value.rules ? [...initialData.value.rules] : [];
			if (initialData.value.rules && initialData.value.rules.length > 0) {
				selectedMode.value = 'conditional-expression';
			} else if (initialData.value.expression) {
				selectedMode.value = 'expression';
			} else {
				selectedMode.value = 'bind';
			}
		} else if (!val) {
			tagValue.value = '';
			expressionValue.value = '';
			rules.value = [];
			selectedMode.value = 'bind';
		}
	});

	const addRule = () => {
		rules.value.push({
			id: Math.random().toString(36).substr(2, 9),
			condition: '',
			expression: ''
		});
	};

	const removeRule = (index: number) => {
		rules.value.splice(index, 1);
	};

	const onDragStart = (e: DragEvent, index: number) => {
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.dropEffect = 'move';
			e.dataTransfer.setData('text/plain', index.toString());
		}
		dragIndex.value = index;
	};

	const onDrop = (_: DragEvent, dropIndex: number) => {
		if (dragIndex.value === null || dragIndex.value === dropIndex) return;

		const rulesCopy = [...rules.value];
		const [draggedItem] = rulesCopy.splice(dragIndex.value, 1);
		if (!draggedItem) return;
		rulesCopy.splice(dropIndex, 0, draggedItem!);
		rules.value = rulesCopy;
		dragIndex.value = null;
	};

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
			tag: tagValue.value,
			expression: expressionValue.value,
			rules: rules.value
		});
	};
</script>

<template>
	<Dialog
		title="Tag Bindings"
		:open="isOpen"
		:style="{
			height: 'min(36rem, calc(100dvh - 4rem))',
			maxWidth: 'min(42rem, calc(100dvw - 12rem))'
		}"
		@update:open="handleOpenChange"
	>
		<div class="flex flex-col gap-6 py-2">
			<RadioGroup
				v-model="selectedMode"
				label="BindingMode"
				:options="options"
				:size="'sm'"
			/>
			<div class="flex flex-col w-full h-full">
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
						as="input"
					/>
				</div>

				<div
					v-else-if="selectedMode === 'conditional-expression'"
					class="animate-in fade-in slide-in-from-top-2 duration-200"
				>
					<div class="flex flex-col gap-4">
						<div class="space-y-3">
							<div
								v-for="(rule, index) in rules"
								:key="rule.id"
								class="flex items-center gap-3 p-3 border rounded-md border-gray-200 bg-gray-50/50 shadow-sm transition-colors hover:bg-gray-50"
								:class="{ 'opacity-50': dragIndex === index }"
								draggable="true"
								@dragstart="onDragStart($event, index)"
								@dragover.prevent
								@drop="onDrop($event, index)"
							>
								<div
									class="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-7"
								>
									<Bars3Icon class="w-5 h-5" />
								</div>

								<div class="flex-1 flex flex-col gap-3">
									<SuggestionInput
										v-model="rule.condition"
										label="Condition"
										:suggestions="tagOptions"
										as="input"
									/>
									<SuggestionInput
										v-model="rule.expression"
										label="Expression"
										:suggestions="tagOptions"
										as="input"
									/>
								</div>

								<div class="shrink-0 mt-7">
									<IconButton
										variant="text"
										color="error"
										aria-label="Remove rule"
										@click="removeRule(index)"
									>
										<TrashIcon class="w-4 h-4" />
									</IconButton>
								</div>
							</div>
						</div>

						<Button
							variant="outlined"
							color="primary"
							class="w-full border-dashed"
							@click="addRule"
						>
							Add Rule
						</Button>
					</div>
				</div>
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
