import { createCustomElement, actionTypes } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';
const {COMPONENT_PROPERTY_CHANGED} = actionTypes;

const customUpdateProperties = (value, updateProperties) => {
	updateProperties(() => {
		return {
			path: 'types',
			value: value,
			shouldUpdate: true
		}
	})
}

const view = (state, {updateProperties}) => {
	const {types, updateTrigger} = state;

	return (
		<div className='mfg-report-a-deviation'>
			<div className='row'>
				<div className='col-md-12 m-b-sm'>
					<span>Select the deviation type(s)</span>
				</div>
			{ 
				Object.keys(types).map((type, i) => {
					return (
						<div key={i} className='col-md-6 m-b-sm'>
							<div className='checkbox'>
								<input 
									id={'deviation-type-checkbox' + i} 
									type='checkbox' value={type} 
									style={{accentColor: 'blue'}} 
									on-click={() => [types[type].selected = !types[type].selected, customUpdateProperties(types, updateProperties)]}
								>
								</input>
								<label 
									for={'deviation-type-checkbox' + i}
									className='p-l-sm'
								>
									{types[type].title}
								</label>
							</div>
						</div>
					)
				})
			}
			</div>
		</div>
	);
};

createCustomElement('snc-x-snc-mfg-macro', {
	renderer: {type: snabbdom},
	transformState(state) {
		const { properties } = state;
		return properties;
	},
	view,
	properties: {
		types: {
			default: {
				unnecessary: { title: 'Unnecessary', selected: false },
				safety_defect: { title: 'Safety Defect', selected: false },
				source_of_contamination: { title: 'Source of Contamination', selected: false },
				quality_defect: { title: 'Quality Defect', selected: false },
				hard_to_reach_area: { title: 'Hard to Reach Area', selected: false },
				lack_of_basic_condition: { title: 'Lack of Basic Condition', selected: false },
				minor_defect: { title: 'Minor Defect', selected: false },
			}
		}
	},
	actionHandlers: {
		[COMPONENT_PROPERTY_CHANGED]({dispatch, properties: {types}, updateState}) {
			let arr = [];
			for (let e in types) {
				if (types[e].selected)
					arr.push(e);
			}
			dispatch('DEVIATION_TYPE_SELECTED', {'event-payload': arr.join(',')});
    }
	},
	styles
});
