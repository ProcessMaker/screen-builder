import { mount } from '@vue/test-utils';
import FormImage from '../../src/components/renderer/form-image';

describe('Test Empty FormImage', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(FormImage, {sync: false});

  it('renders an empty image', () => {
    expect(wrapper.html()).toContain('<div class="form-group form-image"><i class="empty-image far fa-image"></i></div>');
  });
});

describe('Test FormImage with an image and size', () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(FormImage, {sync: false});
  // Image
  const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wIEEw0K4r2NwQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAMSURBVAjXY/j//z8ABf4C/tzMWecAAAAASUVORK5CYII=';
  wrapper.setProps({image, width: '32', height: '32', id:'banner'});

  it('renders the image', () => {
    expect(wrapper.html()).toContain('<div class="form-group form-image"><img src="' + image + '" width="32" height="32" id="banner"></div>');
  });

  // it's also easy to check for the existence of elements
  it('has a <img>', () => {
    expect(wrapper.contains('img')).toBe(true);
  });
});
