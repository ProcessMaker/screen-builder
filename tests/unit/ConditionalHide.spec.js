import {mount} from '@vue/test-utils';
import Renderer from '../../src/components/vue-form-renderer';

describe('Hide or show controls', () => {

    // Now mount the component and you have the wrapper
    const wrapper = mount(Renderer, {
        sync: false,
        propsData: {
            config: [{
                items: [
                    {
                        "config": {
                            "label": "Field test 1",
                            "name": "field1",
                            "placeholder": "",
                            "validation": "",
                            "helper": null,
                            "type": "text"
                        },
                        "label": "Line Input"
                    },
                    {
                        "config": {
                            "label": "Field test 2",
                            "name": "field2",
                            "placeholder": "",
                            "validation": "",
                            "helper": null,
                            "type": "text",
                            "conditionalHide": "field1==\"new Value\""
                        },
                        "label": "Line Input"
                    }]
            }], data: {}, page: 0, computed: []
        }
    });

    it('Hide control with evaluation success', () => {

        //The controls have the option to show by default in true || condition for evaluate field1=="new Value"
        expect(wrapper.vm.showElement.field1).toBe(true);
        expect(wrapper.vm.showElement.field2).toBe(true);

        //When changing the value, the condition is calculated automatically to verify if it is hidden or not
        wrapper.setData({'model': {'field1': 'new Value'}});

        //verify change
        expect(wrapper.vm.showElement.field1).toBe(true);
        expect(wrapper.vm.showElement.field2).toBe(false);
    });

    it('Not Hide control with evaluation failure', () => {

        wrapper.setData({'model': {'field1': ''}});

        //The controls have the option to show by default in true || condition for evaluate field1=="new Value"
        expect(wrapper.vm.showElement.field1).toBe(true);
        expect(wrapper.vm.showElement.field2).toBe(true);

        //When changing the value, the condition is calculated automatically to verify if it is hidden or not
        wrapper.setData({'model': {'field1': 'other value'}});

        //verify change
        expect(wrapper.vm.showElement.field1).toBe(true);
        expect(wrapper.vm.showElement.field2).toBe(true);
    });

});
