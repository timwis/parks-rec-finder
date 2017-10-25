import { mount } from 'avoriaz'
import PhilaTextField from '@/components/phila/phila-text-field'

describe('phila/phila-text-field.vue', () => {
  it('should render a label element', () => {
    const PhilaTextFieldComponent = mount(PhilaTextField)
    expect(PhilaTextFieldComponent.contains('label')).to.equal(true)
  })
  it('should render an input element', () => {
    const PhilaTextFieldComponent = mount(PhilaTextField)
    expect(PhilaTextFieldComponent.contains('input')).to.equal(true)
  })
  it('should render div.input-error', () => {
    const PhilaTextFieldComponent = mount(PhilaTextField)
    expect(PhilaTextFieldComponent.contains('.input-error')).to.equal(true)
  })
  describe(` METHODS:`, () => {
    it('onInput exist', () => {
      const PhilaTextFieldComponent = mount(PhilaTextField)
      expect(typeof PhilaTextFieldComponent.methods().onInput).to.equal('function')
    })
    it('onInput should update lazyValue an inputValue with given string', () => {
      const PhilaTextFieldComponent = mount(PhilaTextField)
      const searchVal = 'search text'
      PhilaTextFieldComponent.vm.onInput({target: {value: searchVal}})
      // updates computed inputValue via onInput method
      expect(PhilaTextFieldComponent.vm.inputValue).to.equal(searchVal)
      // updates lazyValue via inputValue:setter
      expect(PhilaTextFieldComponent.vm.lazyValue).to.equal(searchVal)
      // updates computed isDirty value
      expect(PhilaTextFieldComponent.vm.isDirty).to.be.true
    })
    xit('onInput triggers input event with given value', () => {
      // @TODO
    })
  })
})
