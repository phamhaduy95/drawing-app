<script setup lang="ts">
	import { storeToRefs } from 'pinia';
	import { computed, ref } from 'vue';

	import type { TreeNodeObject } from '@packages/vue-components';
	import {
		Button,
		Dialog,
		RadioGroup,
		SuggestionInput,
		TextInput,
		TreeView
	} from '@packages/vue-components';

	import { useTagsStore } from '@/modules/designer/composables/useTagsStore';
	import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
	import ConditionalRuleRow from './ConditionalRuleRow.vue';
	import { useTagBindingDialog } from './useTagBindingDialog';

	const { store, closeDialog, saveBinding } = useTagBindingDialog();
	const { isOpen, selectedMode, selectedTag, expressionValue, rules } = storeToRefs(store);

	const tagsStore = useTagsStore();
	const { tagOptions } = storeToRefs(tagsStore);

	const options = [
		{ label: 'Direct binding', value: 'direct' },
		{ label: 'Single Expression', value: 'expression' },
		{ label: 'Conditional expression', value: 'conditional' }
	];

	const searchQuery = ref('');

	const treeData = computed<TreeNodeObject[]>(() => {
		const rootChildren: TreeNodeObject[] = [];
		const serverMap = new Map<string, TreeNodeObject>();
		const fbMap = new Map<string, TreeNodeObject>();

		const query = searchQuery.value.toLowerCase();

		tagsStore.tags.forEach((tag) => {
			const base = `Root.${tag.server.name}.${tag.functionBlock.name}`;

			// Filter logic
			const matchesServer = tag.server.name.toLowerCase().includes(query);
			const matchesFb = tag.functionBlock.name.toLowerCase().includes(query);

			const tagFields = ['label', 'description', 'value', 'unit'] as const;
			const validFields = tagFields.filter((field) => {
				if (!query) return true;
				if (matchesServer || matchesFb) return true;
				return field.includes(query) || `${base}.${field}`.toLowerCase().includes(query);
			});

			if (validFields.length === 0) return;

			// 1. Server Node
			let serverNode = serverMap.get(tag.server.id);
			if (!serverNode) {
				serverNode = {
					value: tag.server.id,
					label: tag.server.name,
					children: []
				};
				serverMap.set(tag.server.id, serverNode);
				rootChildren.push(serverNode);
			}

			// 2. Function Block Node
			const fbKey = `${tag.server.id}_${tag.functionBlock.id}`;
			let fbNode = fbMap.get(fbKey);
			if (!fbNode) {
				fbNode = {
					value: fbKey,
					label: tag.functionBlock.name,
					children: []
				};
				fbMap.set(fbKey, fbNode);
				serverNode.children!.push(fbNode);
			}

			// 3. Tag fields
			const fields = validFields.map((field) => ({
				value: `${base}.${field}`,
				label: field,
				isTag: true,
				tag: tag,
				field: field
			}));
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			fbNode.children!.push(...(fields as any));
		});

		return [
			{
				value: 'root',
				label: 'Root',
				children: rootChildren
			}
		];
	});

	const selectedTreeValues = computed({
		get: () => (selectedTag.value ? [selectedTag.value] : []),
		set: (val) => {
			if (val && val.length > 0) {
				selectedTag.value = val[0];
			} else {
				selectedTag.value = undefined;
			}
		}
	});

	const selectedTagDetails = computed(() => {
		if (!selectedTag.value) return null;

		const parts = selectedTag.value.split('.');
		if (parts.length < 4) return null;

		const server = parts[1];
		const block = parts[2];

		const tag = tagsStore.tags.find(
			(t) => t.server.name === server && t.functionBlock.name === block
		);
		if (!tag) return null;

		return {
			name: selectedTag.value,
			description: tag.description?.value || 'N/A',
			unit: tag.unit?.value || 'N/A',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			upperLimit: (tag as any).upperLimit?.value || 'N/A',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			lowerLimit: (tag as any).lowerLimit?.value || 'N/A'
		};
	});

	const addRule = () => {
		rules.value.push({
			id: Math.random().toString(36).substr(2, 9),
			continue: false,
			condition: '',
			expression: ''
		});
	};

	const removeRule = (index: number) => {
		rules.value.splice(index, 1);
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
		saveBinding();
	};
</script>

<template>
	<Dialog
		title="Tag Bindings"
		:open="isOpen"
		:style="{
			height: 'min(36rem, calc(100dvh - 4rem))',
			maxWidth: 'min(45rem, calc(100dvw - 12rem))'
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
					v-if="selectedMode === 'direct'"
					class="animate-in fade-in slide-in-from-top-2 duration-200 flex h-[400px] gap-6"
				>
					<!-- Left Panel: Search & Tree -->
					<div class="w-1/2 flex flex-col gap-3 border-r border-gray-200 pr-6">
						<div class="flex flex-col gap-1.5">
							<label class="text-sm font-medium text-gray-700">Select Tag Binding</label>
							<TextInput
								v-model="searchQuery"
								placeholder="Search Tags..."
								size="sm"
							>
								<template #prefix>
									<MagnifyingGlassIcon class="w-4 h-4 text-gray-400" />
								</template>
							</TextInput>
						</div>
						<div class="flex-1 overflow-y-auto border border-gray-200 rounded-md bg-white">
							<TreeView
								v-model:selected-value="selectedTreeValues"
								:items="treeData"
								class="w-full h-full p-2"
							/>
						</div>
					</div>

					<!-- Right Panel: Details -->
					<div class="w-1/2 flex flex-col gap-4">
						<h3 class="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
							Tag Details
						</h3>
						<div
							v-if="selectedTagDetails"
							class="flex flex-col gap-3 text-sm"
						>
							<div class="grid grid-cols-3 gap-2 pb-2">
								<span class="text-gray-500 font-medium">Name of tag</span>
								<span class="col-span-2 font-medium text-gray-900 break-all">{{
									selectedTagDetails.name
								}}</span>
							</div>
							<div class="grid grid-cols-3 gap-2 pb-2">
								<span class="text-gray-500 font-medium">Description</span>
								<span class="col-span-2 text-gray-900">{{ selectedTagDetails.description }}</span>
							</div>
							<div class="grid grid-cols-3 gap-2 pb-2">
								<span class="text-gray-500 font-medium">Unit</span>
								<span class="col-span-2 text-gray-900">{{ selectedTagDetails.unit }}</span>
							</div>
							<div class="grid grid-cols-3 gap-2 pb-2">
								<span class="text-gray-500 font-medium">Upper limit</span>
								<span class="col-span-2 text-gray-900">{{ selectedTagDetails.upperLimit }}</span>
							</div>
							<div class="grid grid-cols-3 gap-2 pb-2">
								<span class="text-gray-500 font-medium">Lower limit</span>
								<span class="col-span-2 text-gray-900">{{ selectedTagDetails.lowerLimit }}</span>
							</div>
						</div>
						<div
							v-else
							class="flex flex-1 items-center justify-center text-sm text-gray-400 italic bg-gray-50 rounded-md border border-dashed border-gray-200"
						>
							Select a tag to view details
						</div>
					</div>
				</div>

				<div
					v-else-if="selectedMode === 'expression'"
					class="animate-in fade-in slide-in-from-top-2 duration-200"
				>
					<SuggestionInput
						v-model="expressionValue"
						label="Expression"
						trigger-char="%"
						:suggestions="tagOptions"
						placeholder="Enter expression"
						as="textarea"
					/>
				</div>

				<div
					v-else-if="selectedMode === 'conditional'"
					class="animate-in fade-in slide-in-from-top-2 duration-200 h-full flex flex-col"
				>
					<div
						class="border border-gray-200 rounded-md bg-white shadow-sm flex flex-col flex-1 overflow-hidden"
					>
						<div class="flex-1 overflow-y-auto">
							<table class="w-full text-sm text-left">
								<thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
									<tr>
										<th class="p-2 w-16 text-center font-medium text-gray-500">Order</th>
										<th class="p-2 w-20 text-center font-medium text-gray-500">Continue</th>
										<th class="p-2 font-medium text-gray-500">Condition</th>
										<th class="p-2 font-medium text-gray-500">Value</th>
										<th class="p-2 w-12 text-center font-medium text-gray-500"></th>
									</tr>
								</thead>
								<tbody>
									<ConditionalRuleRow
										v-for="(rule, index) in rules"
										:key="rule.id"
										:rule="rule"
										:index="index"
										:tag-options="tagOptions"
										@remove="removeRule(index)"
										@update="
											(newRule) => {
												rules[index] = newRule;
											}
										"
									/>
								</tbody>
							</table>
							<div
								v-if="rules.length === 0"
								class="p-8 text-center text-gray-400 italic"
							>
								No rules added yet.
							</div>
						</div>
						<div class="p-3 border-t border-gray-100 bg-gray-50 mt-auto shrink-0">
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
