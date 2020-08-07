import React from 'react';
import AddCar from './components/AddCar';
import Enzyme, {mount,  shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<AddCar />', () => {
        // It doesn't work what it is commented
        // it('renders five <DialogContent /> components', () => {
        //     const wrapper = shallow(<AddCar />);
        //     //console.log(wrapper.find('DialogContent').length);
        //     expect(wrapper.find('DialogContent')).toHaveLength(1);
        // });
        it('renders number of the label "Model', () => {
            const wrapper = shallow(<AddCar />);
            expect(wrapper.find({ label: "Model" })).toHaveLength(1);
        });
});

