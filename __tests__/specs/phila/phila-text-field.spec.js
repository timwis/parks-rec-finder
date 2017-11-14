import { mount } from 'vue-test-utils'
import PhilaTextField from '@/components/phila/phila-text-field'

describe('PHILA::Text Field: phila/phila-text-field.vue', () => {
  let PhilaTextFieldComponent = mount(PhilaTextField, {propsData: {type: 'text'}})
  const searchVal = 'search text'

  it('should render a label element', () => {
    expect(PhilaTextFieldComponent.contains('label')).toBe(true)
  })
  it('should render an input element', () => {
    expect(PhilaTextFieldComponent.contains('input')).toBe(true)
  })



    describe('onInput:', () => {
      it('triggers "input" event with given value', () => {
        PhilaTextFieldComponent.vm.onInput({target: {value: searchVal}})
        expect(PhilaTextFieldComponent.emitted().input.length).toBe(1)
        expect(PhilaTextFieldComponent.emitted().input[0]).toEqual([searchVal])
      })

      it('updates lazyValue and inputValue data with given string', () => {
        PhilaTextFieldComponent.vm.onInput({target: {value: searchVal}})
        // updates computed inputValue via onInput method
        expect(PhilaTextFieldComponent.vm.inputValue).toBe(searchVal)
        // updates lazyValue via inputValue:setter
        expect(PhilaTextFieldComponent.vm.lazyValue).toBe(searchVal)
      })
      it('updates isDirty to true on user input', () => {
        PhilaTextFieldComponent.vm.onInput({target: {value: searchVal}})
        // updates computed isDirty value
        expect(PhilaTextFieldComponent.vm.isDirty).toBe(true)
      })

    })
    describe('onEnter:', () => {
      it('should emit "enter" event', () => {
        const mockEnterEvent = {key: 'Enter', keyCode: 13}
        PhilaTextFieldComponent.vm.onEnter(mockEnterEvent)
        expect(PhilaTextFieldComponent.emitted().enter).toBeTruthy()
        expect(PhilaTextFieldComponent.emitted().enter.length).toBe(1)
        expect(PhilaTextFieldComponent.emitted().enter[0]).toEqual([mockEnterEvent])
      })
    })
    describe('focus', () => {
      it('should emit "focus" event', () => {
        let input = PhilaTextFieldComponent.find('input')
        input.trigger('focus')
        expect(PhilaTextFieldComponent.emitted().focus).toBeTruthy()
      })
      it('should change focused data to true', () => {
        let input = PhilaTextFieldComponent.find('input')
        // foucues state should have been set in previous it above
        expect(PhilaTextFieldComponent.vm.focused).toBe(true)
      })
    })
    describe('blur', () => {

      xit('should emit "change" event if on blur input element value has changed from initial value', async () => {
        // @TODO figure out how to test change event
        PhilaTextFieldComponent.setData({inputValue: 'asd'})
        expect(PhilaTextFieldComponent.vm.lazyValue).toBe('asd')

        PhilaTextFieldComponent.setData({inputValue: 'fgh'})
        await PhilaTextFieldComponent.vm.$nextTick(() => {})
        expect(PhilaTextFieldComponent.vm.lazyValue).toBe('fgh')
        expect(PhilaTextFieldComponent.emitted().change).toBeTruthy()

      })

      it('should change focused data to false',() => {
        PhilaTextFieldComponent.setData({ focused: true })
        expect(PhilaTextFieldComponent.vm.focused).toBe(true)
        PhilaTextFieldComponent.vm.blur()
        expect(PhilaTextFieldComponent.vm.focused).toBe(false)
      })
    })
  afterEach(() => {
    PhilaTextFieldComponent.destroy()
  })
})
