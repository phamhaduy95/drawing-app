Tag binding

#### Definition

Tag binding is the process of binding a data source to a graphical object's properties such as color, label, border-color, dimenstion.

The Measurement data object and Tag data is defined below:

```typescript
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
	id: string; ;
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
```

Note: The any field inside Meassurement that is assigned TagBalue type such as value, description, unit and so on is considered as a tag.

The tag id often follow this format:
Root.server.functionBlock.Measurement_field_name

For example:
tagId: 'Root.OPCUA.FB001.Value'
tagId: 'Root.OPCUA.FB001.Description'
tagId: 'Root.OPCUA.FB001.Unit'

You can find type definition on `apps/vue-draw/src/modules/designer/types/Tag.type.ts`

To be able to bind tag value to any node property:
The datatype of the tag value must be compatible with the property's datatype.

#### Tag binding management

We will use pinia store to store mapping between tag value to node property.

One tag can be bound to multiple node properties.
One node property can be bound to one tag value only at the time.

The data structure to store tag binding is Map<string,{nodeId:string,field:string}[]> where key is the tag id and value is the list of node property ids that are bound to this tag.

For example:
node-uuid-1:[{nodeId:'aaaa',field:'data.fillColor'},{nodeId:'abc',field:'label'}]

detail spec:

The tag binding pinia store:
state:
{ tagBindings: Map<string,{nodeId:string,field:string}[]> }

methods:

- addTagBinding(tagId: string, nodeId: string, field: string): void
- removeTagBinding(tagId: string, nodeId: string, field: string): void
- removeTag(tagId: string): void
- clear():void

useTagRegister composable: register node's tag bindings to the tag binding store.

- registerTag(tagId: string, node: {nodeId: string, field: string}): void
- unregisterTag(tagId: string, node: {nodeId: string, field: string}): void

#### Tag management store

The Tag management store is a pinia store that stores the available MeasurementType and user can register tags to this store.

state:
{ tags: MeasurementType[] }

methods:

- addTags(tags: MeasurementType[]): void
- removeTags(tagIds: string[]): void
- clear():void

- create pinia store and its extended composiable.
- currently we will use mocked tag lists from
  `apps/vue-draw/src/modules/designer/constant/defaultTags.ts`
