export type TagDataType = 'number' | 'string' | 'boolean' | 'date' | 'time';

export interface MeasurementType {
	id: string; //uuid;
	label: TagValue;
	description: TagValue;
	value: TagValue;
	server: Server;
	functionBlock: FunctionBlock;
	unit: TagValue;
}

export interface TagValue {
	id: string;
	value: string;
	quality: string;
	timestamp: string;
	dataType: TagDataType;
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
