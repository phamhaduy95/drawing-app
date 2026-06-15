<script setup lang="ts">
	import { BaseNode, type BaseNodeProps } from '@/modules/designer/components/Nodes/BaseNode';
	import { computed } from 'vue';
	import type { IndustrialNodeData } from '@/modules/designer/types/Node.type';
	import IconGauge from '@/assets/palettes/industrial/gauge.svg';

	export type GaugeNodeProps = BaseNodeProps;

	const props = defineProps<GaugeNodeProps>();

	const nodeConfig = computed(() => props.data as IndustrialNodeData);
</script>

<template>
	<BaseNode
		v-slot="{ shapeHeight, shapeWidth }"
		v-bind="props"
	>
		<IconGauge
			:style="{
				width: shapeWidth + 'px',
				height: shapeHeight + 'px',
				color: nodeConfig.stroke
			}"
			:stroke="nodeConfig.stroke"
			:stroke-width="nodeConfig.strokeWidth"
			:fill="nodeConfig.fill"
		/>
	</BaseNode>
</template>
