import { mount } from 'avoriaz'
import PhilaTextField from '@/components/phila/phila-text-field'

describe('PHILA::Text Field: phila/phila-text-field.vue', () => {
  let PhilaTextFieldComponent = mount(PhilaTextField, { propsData: { type:'text' }})
  const searchVal = 'search text'

  it('should render a label element', () => {
    expect(PhilaTextFieldComponent.contains('label')).to.equal(true)
  })
  it('should render an input element', () => {
    expect(PhilaTextFieldComponent.contains('input')).to.equal(true)
  })


  describe(`METHODS:`, () => {
    it('')
    describe(' onInput', () => {
      it('exist', () => {
        expect(typeof PhilaTextFieldComponent.methods().onInput).to.equal('function')
      })
      it('updates lazyValue and inputValue data with given string', () => {
        PhilaTextFieldComponent.vm.onInput({target: {value: searchVal}})
        // updates computed inputValue via onInput method
        expect(PhilaTextFieldComponent.vm.inputValue).to.equal(searchVal)
        // updates lazyValue via inputValue:setter
        expect(PhilaTextFieldComponent.vm.lazyValue).to.equal(searchVal)
      })
      it('updates isDirty to true on user input', () => {
        PhilaTextFieldComponent.vm.onInput({target: {value: searchVal}})
        // updates computed isDirty value
        expect(PhilaTextFieldComponent.vm.isDirty).to.equal(true)
      })
      it('triggers "input" event with given value', async () => {
        let InputSpy = sinon.spy()
        PhilaTextFieldComponent.vm.$on('input', InputSpy)
        PhilaTextFieldComponent.vm.onInput({target: {value: searchVal}})
        await PhilaTextFieldComponent.vm.$nextTick()
        InputSpy.should.have.been.calledWith(searchVal)
      })
    })
    describe('onEnter', () => {
      it('exist', () => {
        expect(typeof PhilaTextFieldComponent.methods().onEnter).to.equal('function')
      })
      it('should emit "enter" event', async () => {
        let EnterSpy = sinon.spy()
        const mockEnterEvent = {key: 'Enter', keyCode: 13}
        PhilaTextFieldComponent.vm.$on('enter', EnterSpy)
        PhilaTextFieldComponent.vm.onEnter(mockEnterEvent)
        await PhilaTextFieldComponent.vm.$nextTick()
        EnterSpy.should.have.been.calledWith(mockEnterEvent)
      })
    })
    describe('focus', () => {
      it('exist', () => {
        expect(typeof PhilaTextFieldComponent.methods().focus).to.equal('function')
      })
      it('should change focused data to true', async () =>{
        let input = PhilaTextFieldComponent.find('input')[0]
        expect(PhilaTextFieldComponent.vm.focused).to.equal(false)
        input.trigger('focus')
        await PhilaTextFieldComponent.vm.$nextTick()
        expect(PhilaTextFieldComponent.vm.focused).to.equal(true)
      })
      it('should emit "focus" event', async () => {
        const FocusSpy = sinon.spy()
        PhilaTextFieldComponent.vm.$on('focus', FocusSpy)
        let input = PhilaTextFieldComponent.find('input')[0]
        input.trigger('focus')
        await PhilaTextFieldComponent.vm.$nextTick()
        FocusSpy.should.have.been.called
      })
    })
    describe('blur', () => {
      it('exist', () => {
        expect(typeof PhilaTextFieldComponent.methods().blur).to.equal('function')
      })
      it('should change focused data to false', async () =>{
        PhilaTextFieldComponent.setData({ focused: true})
        PhilaTextFieldComponent.vm.blur()
        await PhilaTextFieldComponent.vm.$nextTick()
        expect(PhilaTextFieldComponent.vm.focused).to.equal(false)
      })
      xit('should emit "change" event if on blur input element value has changed from initial value', async () => {
        // @TODO: figure out how to make this pass
        let value = 'asd'
        PhilaTextFieldComponent = mount(PhilaTextField, { propsData: { type:'text', value }})
        const ChangeSpy = sinon.spy()
        PhilaTextFieldComponent.vm.$on('change', ChangeSpy)


        const input = PhilaTextFieldComponent.find('input')[0]
        input.trigger('focus')
        // await PhilaTextFieldComponent.vm.$nextTick()
        input.element.value = 'fgh'
        PhilaTextFieldComponent.vm.onInput({target: {value: 'fgh'}})
        input.trigger('input')

        // await PhilaTextFieldComponent.vm.$nextTick()
        input.trigger('blur')
        await PhilaTextFieldComponent.vm.$nextTick()
        // expect(PhilaTextFieldComponent.data().lazyValue).to.equal('fgh')
        ChangeSpy.should.have.been.called

      })
    })
  })
  afterEach(() => {
    PhilaTextFieldComponent.destroy()
  })
})
