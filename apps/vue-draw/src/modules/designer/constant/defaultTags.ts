import type { MeasurementType } from '../types/Tag.type';

export const defaultTags: MeasurementType[] = [
	{
		id: 'tag-001',
		label: { value: 'Temperature Sensor 1', quality: 'Good', timestamp: '2026-06-15T10:00:00Z' },
		description: 'Measures the temperature of Reactor A',
		value: { value: '45.5', quality: 'Good', timestamp: '2026-06-15T10:00:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-1', name: 'FB00PDI01', label: 'Temperature Control 1' },
		unit: { value: '°C', quality: 'Good', timestamp: '2026-06-15T10:00:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-002',
		label: { value: 'Pressure Valve A', quality: 'Good', timestamp: '2026-06-15T10:01:00Z' },
		description: 'Line pressure for main pipe',
		value: { value: '120.2', quality: 'Good', timestamp: '2026-06-15T10:01:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-2', name: 'FB00PDI02', label: 'Pressure Monitor 1' },
		unit: { value: 'PSI', quality: 'Good', timestamp: '2026-06-15T10:01:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-003',
		label: { value: 'Pump 1 Status', quality: 'Good', timestamp: '2026-06-15T10:02:00Z' },
		description: 'Running status of cooling pump 1',
		value: { value: 'true', quality: 'Good', timestamp: '2026-06-15T10:02:00Z' },
		server: { id: 'srv-2', name: 'Server2' },
		functionBlock: { id: 'fb-3', name: 'FB00PDI03', label: 'Pump Control 1' },
		unit: { value: '', quality: 'Good', timestamp: '2026-06-15T10:02:00Z' },
		dataType: 'boolean'
	},
	{
		id: 'tag-004',
		label: { value: 'Conveyor Belt Speed', quality: 'Good', timestamp: '2026-06-15T10:03:00Z' },
		description: 'Speed of the primary assembly conveyor',
		value: { value: '2.5', quality: 'Good', timestamp: '2026-06-15T10:03:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-4', name: 'FB00PDI04', label: 'Motor Drive Control 1' },
		unit: { value: 'm/s', quality: 'Good', timestamp: '2026-06-15T10:03:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-005',
		label: { value: 'Tank Level 1', quality: 'Good', timestamp: '2026-06-15T10:04:00Z' },
		description: 'Fill level of Storage Tank 1',
		value: { value: '850', quality: 'Good', timestamp: '2026-06-15T10:04:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-5', name: 'FB00PDI05', label: 'Level Sensor 1' },
		unit: { value: 'L', quality: 'Good', timestamp: '2026-06-15T10:04:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-006',
		label: { value: 'Motor Current', quality: 'Good', timestamp: '2026-06-15T10:05:00Z' },
		description: 'Phase A current for main drive',
		value: { value: '15.4', quality: 'Good', timestamp: '2026-06-15T10:05:00Z' },
		server: { id: 'srv-2', name: 'Server2' },
		functionBlock: { id: 'fb-6', name: 'FB00PDI06', label: 'Motor Drive Control 2' },
		unit: { value: 'A', quality: 'Good', timestamp: '2026-06-15T10:05:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-007',
		label: { value: 'Error Code', quality: 'Good', timestamp: '2026-06-15T10:06:00Z' },
		description: 'Latest system error code',
		value: { value: 'E-404', quality: 'Bad', timestamp: '2026-06-15T10:06:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-7', name: 'FB00PDI07', label: 'System Diagnostics 1' },
		unit: { value: '', quality: 'Good', timestamp: '2026-06-15T10:06:00Z' },
		dataType: 'string'
	},
	{
		id: 'tag-008',
		label: { value: 'Last Maintenance', quality: 'Good', timestamp: '2026-05-01T08:00:00Z' },
		description: 'Date of last scheduled maintenance',
		value: { value: '2026-05-01', quality: 'Good', timestamp: '2026-05-01T08:00:00Z' },
		server: { id: 'srv-3', name: 'Server3' },
		functionBlock: { id: 'fb-8', name: 'FB00PDI08', label: 'Asset Manager 1' },
		unit: { value: '', quality: 'Good', timestamp: '2026-05-01T08:00:00Z' },
		dataType: 'date'
	},
	{
		id: 'tag-009',
		label: { value: 'Runtime', quality: 'Good', timestamp: '2026-06-15T10:08:00Z' },
		description: 'Total operational runtime of Reactor A',
		value: { value: '124:30:00', quality: 'Good', timestamp: '2026-06-15T10:08:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-9', name: 'FB00PDI09', label: 'Temperature Control 2' },
		unit: { value: 'hh:mm:ss', quality: 'Good', timestamp: '2026-06-15T10:08:00Z' },
		dataType: 'time'
	},
	{
		id: 'tag-010',
		label: { value: 'Main Power', quality: 'Good', timestamp: '2026-06-15T10:09:00Z' },
		description: 'Facility main power connection status',
		value: { value: 'true', quality: 'Good', timestamp: '2026-06-15T10:09:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-10', name: 'FB00PDI10', label: 'Power Monitor 1' },
		unit: { value: '', quality: 'Good', timestamp: '2026-06-15T10:09:00Z' },
		dataType: 'boolean'
	},
	{
		id: 'tag-011',
		label: { value: 'Emergency Stop', quality: 'Good', timestamp: '2026-06-15T10:10:00Z' },
		description: 'E-Stop engaged status',
		value: { value: 'false', quality: 'Good', timestamp: '2026-06-15T10:10:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-11', name: 'FB00PDI11', label: 'Safety Controller 1' },
		unit: { value: '', quality: 'Good', timestamp: '2026-06-15T10:10:00Z' },
		dataType: 'boolean'
	},
	{
		id: 'tag-012',
		label: { value: 'Humidity Sensor', quality: 'Good', timestamp: '2026-06-15T10:11:00Z' },
		description: 'Ambient humidity in Room C',
		value: { value: '42.1', quality: 'Good', timestamp: '2026-06-15T10:11:00Z' },
		server: { id: 'srv-2', name: 'Server2' },
		functionBlock: { id: 'fb-12', name: 'FB00PDI12', label: 'HVAC Control 1' },
		unit: { value: '%', quality: 'Good', timestamp: '2026-06-15T10:11:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-013',
		label: { value: 'Cooling Fan RPM', quality: 'Good', timestamp: '2026-06-15T10:12:00Z' },
		description: 'Exhaust fan rotational speed',
		value: { value: '1450', quality: 'Good', timestamp: '2026-06-15T10:12:00Z' },
		server: { id: 'srv-2', name: 'Server2' },
		functionBlock: { id: 'fb-13', name: 'FB00PDI13', label: 'HVAC Control 2' },
		unit: { value: 'RPM', quality: 'Good', timestamp: '2026-06-15T10:12:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-014',
		label: { value: 'Valve B Position', quality: 'Good', timestamp: '2026-06-15T10:13:00Z' },
		description: 'Open percentage for Valve B',
		value: { value: '75', quality: 'Good', timestamp: '2026-06-15T10:13:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-14', name: 'FB00PDI14', label: 'Valve Controller 1' },
		unit: { value: '%', quality: 'Good', timestamp: '2026-06-15T10:13:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-015',
		label: { value: 'Batch ID', quality: 'Good', timestamp: '2026-06-15T10:14:00Z' },
		description: 'Current production batch identifier',
		value: { value: 'BCH-8992A', quality: 'Good', timestamp: '2026-06-15T10:14:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-15', name: 'FB00PDI15', label: 'Batch Manager 1' },
		unit: { value: '', quality: 'Good', timestamp: '2026-06-15T10:14:00Z' },
		dataType: 'string'
	},
	{
		id: 'tag-016',
		label: { value: 'System Status', quality: 'Good', timestamp: '2026-06-15T10:15:00Z' },
		description: 'Overall SCADA system state',
		value: { value: 'Nominal', quality: 'Good', timestamp: '2026-06-15T10:15:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-16', name: 'FB00PDI16', label: 'System Diagnostics 2' },
		unit: { value: '', quality: 'Good', timestamp: '2026-06-15T10:15:00Z' },
		dataType: 'string'
	},
	{
		id: 'tag-017',
		label: { value: 'Flow Rate A', quality: 'Good', timestamp: '2026-06-15T10:16:00Z' },
		description: 'Liquid flow rate in line 1',
		value: { value: '350.5', quality: 'Good', timestamp: '2026-06-15T10:16:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-17', name: 'FB00PDI17', label: 'Flow Monitor 1' },
		unit: { value: 'GPM', quality: 'Good', timestamp: '2026-06-15T10:16:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-018',
		label: { value: 'Vibration Sensor', quality: 'Good', timestamp: '2026-06-15T10:17:00Z' },
		description: 'Vibration levels on Motor 2',
		value: { value: '2.1', quality: 'Warning', timestamp: '2026-06-15T10:17:00Z' },
		server: { id: 'srv-2', name: 'Server2' },
		functionBlock: { id: 'fb-18', name: 'FB00PDI18', label: 'Condition Monitor 1' },
		unit: { value: 'mm/s', quality: 'Good', timestamp: '2026-06-15T10:17:00Z' },
		dataType: 'number'
	},
	{
		id: 'tag-019',
		label: { value: 'Heater Status', quality: 'Good', timestamp: '2026-06-15T10:18:00Z' },
		description: 'Pre-heater active state',
		value: { value: 'true', quality: 'Good', timestamp: '2026-06-15T10:18:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-19', name: 'FB00PDI19', label: 'Temperature Control 3' },
		unit: { value: '', quality: 'Good', timestamp: '2026-06-15T10:18:00Z' },
		dataType: 'boolean'
	},
	{
		id: 'tag-020',
		label: { value: 'Main Voltage', quality: 'Good', timestamp: '2026-06-15T10:19:00Z' },
		description: 'Incoming phase voltage',
		value: { value: '480', quality: 'Good', timestamp: '2026-06-15T10:19:00Z' },
		server: { id: 'srv-1', name: 'Server1' },
		functionBlock: { id: 'fb-20', name: 'FB00PDI20', label: 'Power Monitor 2' },
		unit: { value: 'V', quality: 'Good', timestamp: '2026-06-15T10:19:00Z' },
		dataType: 'number'
	}
];

export const tagOptions = defaultTags.flatMap((tag) => {
	const base = `Root.${tag.server.name}.${tag.functionBlock.name}`;
	const options: { label: string; value: string }[] = [];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const addFields = (obj: Record<string, any>, currentPrefix: string) => {
		for (const [key, val] of Object.entries(obj)) {
			if (key === 'id' || key === 'server' || key === 'functionBlock' || key === 'dataType')
				continue;

			if (val && typeof val === 'object') {
				addFields(val, `${currentPrefix}.${key}`);
			} else {
				const optionStr = `${currentPrefix}.${key}`;
				options.push({ label: optionStr, value: optionStr });
			}
		}
	};

	addFields(tag, base);
	return options;
});
