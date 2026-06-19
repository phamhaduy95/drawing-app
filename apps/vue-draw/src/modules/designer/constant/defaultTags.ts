import type { MeasurementType } from '../types/Tag.type';

export const mockedInitalTags: MeasurementType[] = [
	{
		id: 'tag-001',
		label: {
			id: 'tag-001-label',
			value: 'Temperature Sensor 1',
			quality: 'Good',
			timestamp: '2026-06-15T10:00:00Z',
			dataType: 'string'
		},
		description: {
			id: 'tag-001-desc',
			value: 'Measures the temperature of Reactor A',
			quality: 'Good',
			timestamp: '2026-06-15T10:00:00Z',
			dataType: 'string'
		},
		value: {
			id: 'tag-001-value',
			value: '45.5',
			quality: 'Good',
			timestamp: '2026-06-15T10:00:00Z',
			dataType: 'number'
		},
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-1', name: 'FB00PDI01', label: 'Temperature Control 1' },
		unit: {
			id: 'tag-001-unit',
			value: '°C',
			quality: 'Good',
			timestamp: '2026-06-15T10:00:00Z',
			dataType: 'string'
		}
	},
	{
		id: 'tag-002',
		label: {
			id: 'tag-002-label',
			value: 'Pressure Valve A',
			quality: 'Good',
			timestamp: '2026-06-15T10:01:00Z',
			dataType: 'string'
		},
		description: {
			id: 'tag-002-desc',
			value: 'Line pressure for main pipe',
			quality: 'Good',
			timestamp: '2026-06-15T10:01:00Z',
			dataType: 'string'
		},
		value: {
			id: 'tag-002-value',
			value: '120.2',
			quality: 'Good',
			timestamp: '2026-06-15T10:01:00Z',
			dataType: 'number'
		},
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-2', name: 'FB00PDI02', label: 'Pressure Monitor 1' },
		unit: {
			id: 'tag-002-unit',
			value: 'PSI',
			quality: 'Good',
			timestamp: '2026-06-15T10:01:00Z',
			dataType: 'string'
		}
	},
	{
		id: 'tag-003',
		label: {
			id: 'tag-003-label',
			value: 'Pump 1 Status',
			quality: 'Good',
			timestamp: '2026-06-15T10:02:00Z',
			dataType: 'string'
		},
		description: {
			id: 'tag-003-desc',
			value: 'Running status of cooling pump 1',
			quality: 'Good',
			timestamp: '2026-06-15T10:02:00Z',
			dataType: 'string'
		},
		value: {
			id: 'tag-003-value',
			value: 'true',
			quality: 'Good',
			timestamp: '2026-06-15T10:02:00Z',
			dataType: 'boolean'
		},
		server: { id: 'srv-2', name: 'Server2' },
		functionBlock: { id: 'fb-3', name: 'FB00PDI03', label: 'Pump Control 1' },
		unit: {
			id: 'tag-003-unit',
			value: '',
			quality: 'Good',
			timestamp: '2026-06-15T10:02:00Z',
			dataType: 'string'
		}
	},
	{
		id: 'tag-004',
		label: {
			id: 'tag-004-label',
			value: 'Conveyor Belt Speed',
			quality: 'Good',
			timestamp: '2026-06-15T10:03:00Z',
			dataType: 'string'
		},
		description: {
			id: 'tag-004-desc',
			value: 'Speed of the primary assembly conveyor',
			quality: 'Good',
			timestamp: '2026-06-15T10:03:00Z',
			dataType: 'string'
		},
		value: {
			id: 'tag-004-value',
			value: '2.5',
			quality: 'Good',
			timestamp: '2026-06-15T10:03:00Z',
			dataType: 'number'
		},
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-4', name: 'FB00PDI04', label: 'Motor Drive Control 1' },
		unit: {
			id: 'tag-004-unit',
			value: 'm/s',
			quality: 'Good',
			timestamp: '2026-06-15T10:03:00Z',
			dataType: 'string'
		}
	},
	{
		id: 'tag-005',
		label: {
			id: 'tag-005-label',
			value: 'Tank Level 1',
			quality: 'Good',
			timestamp: '2026-06-15T10:04:00Z',
			dataType: 'string'
		},
		description: {
			id: 'tag-005-desc',
			value: 'Fill level of Storage Tank 1',
			quality: 'Good',
			timestamp: '2026-06-15T10:04:00Z',
			dataType: 'string'
		},
		value: {
			id: 'tag-005-value',
			value: '850',
			quality: 'Good',
			timestamp: '2026-06-15T10:04:00Z',
			dataType: 'number'
		},
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-5', name: 'FB00PDI05', label: 'Level Sensor 1' },
		unit: {
			id: 'tag-005-unit',
			value: 'L',
			quality: 'Good',
			timestamp: '2026-06-15T10:04:00Z',
			dataType: 'string'
		}
	}
];

export const tagOptions = mockedInitalTags.flatMap((tag) => {
	const base = `Root.${tag.server.name}.${tag.functionBlock.name}`;
	const options: { label: string; value: string }[] = [];

	const tagFields = ['label', 'description', 'value', 'unit'];
	tagFields.forEach((field) => {
		const optionStr = `${base}.${field}`;
		options.push({ label: optionStr, value: optionStr });
	});

	return options;
});
