export type TagDataType = 'number' | 'string' | 'boolean' | 'date' | 'time';

export interface MeasurementType {
	id: string;
	label: TagValue;
	description: string;
	value: TagValue;
	server: Server;
	functionBlock: FunctionBlock;
	unit: TagValue;
	dataType: TagDataType;
}

export interface TagValue {
	value: string;
	quality: string;
	timestamp: string;
}

export interface Server {
	id: string;
	name: string;
}

export interface FunctionBlock {
	id: string;
	name: string;
	label: string;
}
