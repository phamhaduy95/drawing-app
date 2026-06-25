<script setup lang="ts">
	import { computed } from 'vue';
	import { useVueFlow } from '@vue-flow/core';
	import { storeToRefs } from 'pinia';
	import { useClipboard } from '@/modules/designer/composables/useClipboard';
	import { useGrouping } from '@/modules/designer/composables/useGrouping';
	import { useZindex } from '@/modules/designer/composables/useZindex';
	import { useNodeTagBinding } from '@/modules/designer/composables/useNodeTagBinding';
	import { useSimulation } from '@/modules/designer/composables/useSimulation';

	import IconBringToFront from '@assets/toolbar-icons/bring-to-front.svg';
	import IconCopy from '@assets/toolbar-icons/copy.svg';
	import IconGroup from '@assets/toolbar-icons/group.svg';
	import IconPaste from '@assets/toolbar-icons/paste.svg';
	import IconSendToBack from '@assets/toolbar-icons/send-to-back.svg';
	import IconUnGroup from '@assets/toolbar-icons/ungroup.svg';
	import IconTrend from '@assets/toolbar-icons/trend.svg';
	import IconAlarm from '@assets/toolbar-icons/alarm.svg';
	import IconDuplicate from '@assets/toolbar-icons/duplicate.svg';

	const { getSelectedNodes, viewport } = useVueFlow();
	const { canCopy, canPaste, copyNodes, pasteNodes } = useClipboard();
	const { groupSelectedNodes, ungroup, canGroup, canUngroup } = useGrouping();
	const { bringToFront, sendToBack, canChangeZIndex } = useZindex();

	const simulationStore = useSimulation();
	const { mode } = storeToRefs(simulationStore);

	const selectedNodes = computed(() => getSelectedNodes.value);
	const isVisible = computed(() => selectedNodes.value.length > 0 && mode.value === 'design');
	const isMultiple = computed(() => selectedNodes.value.length > 1);

	const activeNodeId = computed(() => {
		const nodes = selectedNodes.value;
		return nodes.length === 1 ? nodes[0]?.id : undefined;
	});

	const { hasLinkedTags } = useNodeTagBinding(activeNodeId);

	const position = computed(() => {
		if (!isVisible.value) return { top: '0px', left: '0px' };

		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;

		selectedNodes.value.forEach((node) => {
			const x = node.position.x;
			const y = node.position.y;
			const w = node.dimensions?.width || 0;

			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x + w > maxX) maxX = x + w;
		});

		// center x in graph coordinates
		const centerX = (minX + maxX) / 2;
		const topY = minY;

		// convert to screen coordinates relative to the VueFlow container
		const zoom = viewport.value.zoom;
		const vx = viewport.value.x;
		const vy = viewport.value.y;

		const screenX = centerX * zoom + vx;
		const screenY = topY * zoom + vy;

		return {
			left: `${screenX}px`,
			top: `${screenY}px`,
			transform: 'translate(-50%, calc(-100% - 16px))' // 16px offset above the nodes
		};
	});

	const duplicateNodes = () => {
		copyNodes();
		pasteNodes({});
	};

	const openTrendPage = () => {
		window.open('/trend-page', '_blank');
	};

	const openAlarmPage = () => {
		window.open('/alarm-page', '_blank');
	};
</script>

<template>
	<div
		v-if="isVisible"
		class="absolute z-1 flex items-center space-x-1 rounded-md border border-gray-200 bg-white p-1 shadow-md transition-all duration-150"
		:style="position"
	>
		<!-- Group 1: copy, paste, duplicate -->
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				canCopy
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="!canCopy"
			title="Copy"
			@click="copyNodes()"
		>
			<IconCopy class="h-4 w-4" />
		</button>
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				canPaste
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="!canPaste"
			title="Paste"
			@click="pasteNodes({})"
		>
			<IconPaste class="h-4 w-4" />
		</button>
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				canCopy
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="!canCopy"
			title="Duplicate"
			@click="duplicateNodes"
		>
			<IconDuplicate class="h-4 w-4" />
		</button>

		<div class="mx-1 h-4 w-px bg-gray-300"></div>

		<!-- Group 2: group, ungroup -->
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				canGroup
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="!canGroup"
			title="Group"
			@click="groupSelectedNodes"
		>
			<IconGroup class="h-4 w-4" />
		</button>
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				canUngroup
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="!canUngroup"
			title="Ungroup"
			@click="ungroup"
		>
			<IconUnGroup class="h-4 w-4" />
		</button>

		<div class="mx-1 h-4 w-px bg-gray-300"></div>

		<!-- Group 3: bring to front, send to back -->
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				canChangeZIndex
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="!canChangeZIndex"
			title="Bring to Front"
			@click="bringToFront"
		>
			<IconBringToFront class="h-4 w-4" />
		</button>
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				canChangeZIndex
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="!canChangeZIndex"
			title="Send to Back"
			@click="sendToBack"
		>
			<IconSendToBack class="h-4 w-4" />
		</button>

		<div class="mx-1 h-4 w-px bg-gray-300"></div>

		<!-- Group 4: go to trend, go to Alarm and Event -->
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				!isMultiple && hasLinkedTags
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="isMultiple || !hasLinkedTags"
			title="Go to Trend"
			@click="openTrendPage"
		>
			<IconTrend class="h-4 w-4" />
		</button>
		<button
			class="toolbar-btn tooltip-trigger rounded p-1 focus:outline-none"
			:class="
				!isMultiple && hasLinkedTags
					? 'cursor-pointer text-gray-600 hover:bg-gray-100'
					: 'cursor-not-allowed text-gray-300'
			"
			:disabled="isMultiple || !hasLinkedTags"
			title="Go to Alarm"
			@click="openAlarmPage"
		>
			<IconAlarm class="h-4 w-4" />
		</button>
	</div>
</template>
