<script setup lang="ts">
	import { computed } from 'vue';
	import { TreeView, type TreeNodeObject } from '@packages/vue-components';
	import { useDnD } from '@/modules/designer/composables/useDnD';
	import { useTagsStore } from '@/modules/designer/composables/useTagsStore';
	import type { MeasurementType, TagValue } from '@/modules/designer/types/Tag.type';

	const { onPaletteDragStart } = useDnD();
	const tagsStore = useTagsStore();

	const buildNodeFromObject = (
		obj: MeasurementType | TagValue,
		prefix: string,
		fullTag: MeasurementType
	): TreeNodeObject[] => {
		if (!obj || typeof obj !== 'object') return [];

		const children: TreeNodeObject[] = [];
		for (const [key, val] of Object.entries(obj)) {
			if (key === 'id' || key === 'server' || key === 'functionBlock' || key === 'dataType')
				continue;

			if (val && typeof val === 'object') {
				children.push({
					value: `${prefix}_${key}`,
					label: key,
					children: buildNodeFromObject(val as TagValue, `${prefix}_${key}`, fullTag)
				});
			} else {
				children.push({
					value: `${prefix}_${key}`,
					label: key,
					isTag: true,
					tag: fullTag
				} as unknown as TreeNodeObject);
			}
		}
		return children;
	};

	const treeData = computed<TreeNodeObject[]>(() => {
		const rootChildren: TreeNodeObject[] = [];
		const serverMap = new Map<string, TreeNodeObject>();
		const fbMap = new Map<string, TreeNodeObject>();

		tagsStore.tags.forEach((tag) => {
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

			// 3. Tag fields (Directly under FB node)
			const fields = buildNodeFromObject(tag, tag.id, tag);
			fbNode.children!.push(...fields);
		});

		return [
			{
				value: 'root',
				label: 'Root',
				children: rootChildren
			}
		];
	});
</script>

<template>
	<div class="flex flex-col h-[100dvh] w-full">
		<div class="border-b border-gray-100 px-4 py-3 shrink-0">
			<h2 class="text-sm font-semibold uppercase tracking-wider text-gray-800">Value Tags</h2>
		</div>
		<div class="p-0 flex-1 overflow-y-auto h-full">
			<TreeView
				:items="treeData"
				class="w-full h-full"
			>
				<template #treeNodeLabel="{ node }">
					<div
						v-if="(node as any).isTag"
						class="flex items-center w-full cursor-grab active:cursor-grabbing hover:bg-gray-50 rounded"
						draggable="true"
						@dragstart="onPaletteDragStart($event, { isTag: true, tag: (node as any).tag } as any)"
					>
						<span class="text-xs text-gray-700">{{ node.label }}</span>
					</div>
					<div
						v-else
						class="text-xs text-gray-700"
					>
						{{ node.label }}
					</div>
				</template>
			</TreeView>
		</div>
	</div>
</template>
