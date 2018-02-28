import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

const { pre, div, h1, button } = hh(h);

function formView(dispatch, model) {
    return button(
        { className: 'f3 pv2 ph3 bg-blue white bn' },
        'Add Meal'
    )
}

function view(dispatch, model) {
    return div({ className: 'mw6 center' }, [
        h1({ className: 'f2 pv2 bb'}, 'CalorieCounter' ),
        formView(),
        pre(JSON.stringify(model, null, 2))
    ])
    
}

export default view;