import type { BaseNodeData } from '@/modules/designer/types/Node.type';
import type { NodeProps } from '@vue-flow/core';
import type { ConnectorProps } from './BaseNodeConnector.vue';
import type {
	NodeResizerProps,
	OnResize,
	OnResizeEnd,
	OnResizeStart
} from '@vue-flow/node-resizer';
import type { CSSProperties } from 'vue';

export interface BaseNodeProps extends NodeProps<BaseNodeData> {
	defaultNodeWidth?: number;
	defaultNodeHeight?: number;
	keepAspectRatio?: boolean;
	hideConnector?: boolean;
	connectors?: ConnectorProps[];
	keepDefaultRatio?: boolean;
	dynamicSize?: boolean;
}

export type BaseNodeResizerProps = NodeResizerProps & {
	selected: boolean;
	resizeStart: (event: OnResizeStart) => void;
	resize: (event: OnResize) => void;
	resizeEnd: (event: OnResizeEnd) => void;
	lineStyle?: CSSProperties;
	handleStyle?: CSSProperties;
	minWidth?: number;
	minHeight?: number;
	keepAspectRatio?: boolean;
};

export type BaseNodeSlots = {
	resizer?: (props: BaseNodeResizerProps) => void;
	rotateHandler?: (props: { selected: boolean }) => void;
	connector?: (props: {
		isVisible: boolean;
		shapeWidth: number;
		shapeHeight: number;
		isNodeSelected: boolean;
	}) => void;
	default?: (props: { shapeWidth: number; shapeHeight: number }) => void;
};
